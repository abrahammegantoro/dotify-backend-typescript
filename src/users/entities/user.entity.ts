import { Post } from 'src/posts/entities/post.entity';
import { PrimaryGeneratedColumn, Column, Entity, OneToMany } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];

  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}
