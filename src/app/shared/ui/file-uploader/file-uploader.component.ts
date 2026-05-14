import { GlobalStateService } from '@/shared/services/global-state.service';
import { FileUpload } from '@/shared/types/file-upload.type';
import { TrashIconComponent } from '@/shared/ui/icons/trash-icon.component';
import { UploadIconComponent } from '@/shared/ui/icons/upload-icon.component';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  ElementRef,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';

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

  private readonly fileInput = viewChild.required<ElementRef<HTMLInputElement>>('fileInput');

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
      this.stateService.setError(
        `Invalid file type. Only ${this.acceptedTypes.join(', ')} are allowed.`,
      );
      return false;
    }

    if (file.size > this.maxSize()) {
      const mbSize = this.maxSize() / (KILOBYTES * KILOBYTES);
      this.stateService.setError(`File is too large. Maximum size is ${mbSize}MB.`);
      return false;
    }

    return true;
  }

  private parseBase64String(data?: string) {
    // 1. Split the string into two parts at the comma
    const [header = '', inlineData = ''] = data?.split(',') || [];
    // 2. Extract the MIME type from the header
    // Header looks like: "data:image/png;base64"
    // We want to remove "data:" and ";base64" to just get "image/png"
    const mimeType = header.split(':')[1].split(';')[0];

    return { mimeType, inlineData };
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
      const base64Parts = this.parseBase64String(this.previewUrl());
      this.fileChanged.emit({ file, ...base64Parts });
    };

    this.currentReader.onerror = () => {
      this.stateService.setError('An error occurred while reading the file.');
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
    this.stateService.setError('');

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
    this.stateService.setError('');
    this.stateService.stopLoading();
    this.fileInput().nativeElement.value = '';
  }
}
