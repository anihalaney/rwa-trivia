
export class AchievementRule {
  id?: string;
  name: string;
  property: any;
  iconPath: string;
  displayOrder: number;

  constructor(name: string, property: any, displayOrder: number, iconPath?: string, id?: string) {
    this.name = name;
    this.property = property;
    this.displayOrder = displayOrder;

    if (iconPath) {
      this.iconPath = iconPath;
    }

    if (id) {
      this.id = id;
    }

  }

}
