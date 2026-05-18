import Entity from "@domain/entities/entity/entity.entities.js";
import Provider from "@domain/type/provider.type.js";

interface UserProps {
  id: string;
  firstName: string;
  lastName: string;
  auth_id: string;
  avatarUrl?: string|undefined;
  sex: string;
  dateOfBirth:Date
}

class User {
  private id: string;
  private firstName!: string;
  private lastName!: string;
  private auth_id: string;
  private avatarUrl?: string | undefined;
  private sex: string;
  private dateOfBirth:Date|undefined;

  constructor(props: UserProps) {
    ((this.id = props.id), (this.firstName = props.firstName));
    this.lastName = props.lastName;
    this.auth_id = props.auth_id;
    this.avatarUrl = props.avatarUrl;
    this.sex = props.sex;
    this.dateOfBirth = props.dateOfBirth
  }

  get info() {
    return {
      firstName: this.firstName,
      id: this.id,
      lastName: this.lastName,
      auth_id: this.auth_id,
      avatarUrl: this.avatarUrl,
      sex: this.sex,
      dateOfBirth:this.dateOfBirth
    };
  }
}

export default User;
