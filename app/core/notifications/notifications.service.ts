import { Injectable } from "@angular/core";

@Injectable()
export class NotificationsService {
  public notify: (title: string, text: string, group: string, route: string, persist: boolean) => void;
}
