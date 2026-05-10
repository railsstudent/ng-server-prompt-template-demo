import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { TrashIconComponent } from '../icons/trash-icon.component';
import { UploadIconComponent } from '../icons/upload-icon.component';
import { GlobalStateService } from '../services/global-state.service';
import { FileUpload } from '../types/file-upload.type';

const KILOBYTES = 1024;
const MAX_MBS = 20;

@Component({
  selector: 'app-file-uploader',
  imports: [TrashIconComponent, UploadIconComponent],
  templateUrl: './file-uploader.component.html',
  styleUrl: './file-uploader.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileUploaderComponent {
  private stateService = inject(GlobalStateService);
  private destroyRef = inject(DestroyRef);

  maxSize = input(MAX_MBS * KILOBYTES * KILOBYTES);
  fileChanged = output<FileUpload | undefined>();

  protected isDragOver = signal(false);
  protected previewUrl = signal<string | undefined>(undefined);
  protected uploadProgress = signal<number | null>(null);

  private acceptedTypes = ['PNG', 'JPG', 'JPEG', 'WEBP'];
  private currentReader: FileReader | null = null;

  protected helperText = computed(() => {
    const types = this.acceptedTypes.join(', ');
    const mbSize = this.maxSize() / (KILOBYTES * KILOBYTES);
    return `${types} up to ${mbSize}MB`;
  });

  protected hasError = computed(() => this.stateService.isError());
  protected errorMessage = computed(
    () => this.stateService.errorMsg() || 'An unknown error occurred while selecting the file.',
  );

  constructor() {
    this.destroyRef.onDestroy(() => {
      this.currentReader?.abort();
      this.currentReader = null;
      this.previewUrl.set(undefined);
    });
  }

  private validateFile(file: File): boolean {
    const extension = file.name.split('.').pop()?.toLowerCase();
    const isValidType = this.acceptedTypes.map((t) => t.toLowerCase()).includes(extension || '');

    if (!isValidType) {
      this.stateService.isError.set(true);
      this.stateService.errorMsg.set(
        `Invalid file type. Only ${this.acceptedTypes.join(', ')} are allowed.`,
      );
      return false;
    }

    if (file.size > this.maxSize()) {
      this.stateService.isError.set(true);
      const mbSize = this.maxSize() / (KILOBYTES * KILOBYTES);
      this.stateService.errorMsg.set(`File is too large. Maximum size is ${mbSize}MB.`);
      return false;
    }

    return true;
  }

  private processFile(file: File) {
    this.currentReader?.abort();
    this.uploadProgress.set(0);

    this.currentReader = new FileReader();

    this.currentReader.onprogress = (event: ProgressEvent<FileReader>) => {
      if (event.lengthComputable) {
        const percentLoaded = Math.round((event.loaded / event.total) * 100);
        this.uploadProgress.set(percentLoaded);
      }
    };

    this.currentReader.onload = () => {
      this.previewUrl.set(this.currentReader?.result as string);
      this.uploadProgress.set(null);
      this.fileChanged.emit({ file, url: this.previewUrl() || '' });
    };

    this.currentReader.onerror = () => {
      this.stateService.isError.set(true);
      this.stateService.errorMsg.set('An error occurred while reading the file.');
      this.uploadProgress.set(null);
    };

    this.currentReader.readAsDataURL(file);
  }

  protected onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragOver.set(true);
  }

  protected onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.isDragOver.set(false);
  }

  protected onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragOver.set(false);

    const file = event.dataTransfer?.files[0];
    if (file) {
      this.handleFileSelection(file);
    }
  }

  protected onFileSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      this.handleFileSelection(file);
    }
  }

  private handleFileSelection(file: File) {
    this.stateService.isError.set(false);
    this.stateService.errorMsg.set('');

    if (this.validateFile(file)) {
      this.processFile(file);
    }
  }

  protected removeFile(event: Event) {
    event.stopPropagation();
    this.currentReader?.abort();
    this.currentReader = null;
    this.previewUrl.set(undefined);
    this.uploadProgress.set(null);
    this.fileChanged.emit(undefined);
    this.stateService.isError.set(false);
    this.stateService.errorMsg.set('');
  }
}
