import { IMAGE_FILE_TYPES } from '@shared/constants';
import { stringFrom } from './string.utils';

export const validateImageFile = (file: File | undefined): boolean => {
  if(!file) { return false}
  const fileExtension = stringFrom(file.name.split('.').pop());
  return Object.values(IMAGE_FILE_TYPES as string[]).includes(fileExtension);
}
