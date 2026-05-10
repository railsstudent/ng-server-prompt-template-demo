import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FileUploaderComponent } from '../ui/file-uploader/file-uploader.component';

@Component({
  selector: 'app-edit-image',
  imports: [FileUploaderComponent],
  templateUrl: './edit-image.component.html',
  styleUrl: './edit-image.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class EditImageComponent {
  onFileChanged(file: File | undefined) {
    if (file) {
      console.log('HomeComponent received file:', file.name);
    } else {
      console.log('HomeComponent: File removed.');
    }
  }
}
