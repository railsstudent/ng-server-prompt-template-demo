import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FileUploaderComponent } from '../ui/file-uploader/file-uploader.component';

@Component({
  selector: 'app-home',
  imports: [FileUploaderComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class HomeComponent {
  onFileChanged(file: File | undefined) {
    if (file) {
      console.log('HomeComponent received file:', file.name);
    } else {
      console.log('HomeComponent: File removed.');
    }
  }
}
