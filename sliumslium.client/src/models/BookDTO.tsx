export interface BookDTO {
  id: number;
  name: string;
  year: number;
  type: "Book" | "Audiobook";
  pictureUrl: string;
}
