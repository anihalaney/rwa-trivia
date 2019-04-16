export class AchievementRule {
  id?: string;
  name: string;
  property: any;

  constructor(name: string, property: any, id?: string) {
    this.name = name;
    this.property = property;

    if (id) {
      this.id = id;
    }

  }


  getDbModel(): any {
    const dbModel = {
      'name': this.name,
      'property': this.property,
    };
    if (this.id) {
      dbModel['id'] = this.id;
    }
    return dbModel;
  }
}
