import { TemplateKey } from '@/ai/types/template-key.type';
import { FileUpload } from '@/ui/types/file-upload.type';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FileUploaderComponent } from '../ui/file-uploader/file-uploader.component';

@Component({
  selector: 'app-edit-image',
  imports: [FileUploaderComponent],
  templateUrl: './edit-image.component.html',
  styleUrl: './edit-image.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class EditImageComponent {
  pageTitle = input('');
  templateKey = input.required<TemplateKey | undefined>();

  onFileChanged(file: FileUpload | undefined) {
    if (file) {
      console.log('HomeComponent received file:', file.file.name, file.url.length);
    } else {
      console.log('HomeComponent: File removed.');
    }
  }

  generateImage(event$: Event) {
    event$.preventDefault();
    console.log('Generate an image...');
  }
}
