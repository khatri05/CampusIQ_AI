import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ApiService } from '../../../core/services/api.service';

interface Skill {
  id?: string;
  skillName: string;
  category: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  yearsOfExperience: number;
  description: string;
  studentId?: string;
  createdAt?: any;
  updatedAt?: any;
}

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './skills.component.html',
  styleUrl: './skills.component.css'
})
export class SkillsComponent implements OnInit {

  skills: Skill[] = [];

  loading = false;
  saving = false;

  errorMessage = '';
  successMessage = '';

  showForm = false;
  isEditMode = false;

  selectedSkillId: string | null = null;

  skillForm: Skill = {
    skillName: '',
    category: '',
    level: 'Beginner',
    yearsOfExperience: 0,
    description: ''
  };

  levels = [
    'Beginner',
    'Intermediate',
    'Advanced',
    'Expert'
  ];

  constructor(
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.loadSkills();
  }

  async loadSkills(): Promise<void> {

    this.loading = true;
    this.errorMessage = '';

    try {

      const response =
        await this.apiService.get<any>('/skills/me');

      console.log('Skills response:', response);

      this.skills = response?.data || [];

    } catch (error: any) {

      console.error('Load skills error:', error);

      this.skills = [];

      this.errorMessage =
        error?.error?.message ||
        error?.message ||
        'Unable to load skills.';

    } finally {

      this.loading = false;
    }
  }

  openAddForm(): void {

    this.resetForm();

    this.isEditMode = false;
    this.showForm = true;

    this.clearMessages();
  }

  openEditForm(skill: Skill): void {

    this.isEditMode = true;
    this.showForm = true;

    this.selectedSkillId = skill.id || null;

    this.skillForm = {
      skillName: skill.skillName || '',
      category: skill.category || '',
      level: skill.level || 'Beginner',
      yearsOfExperience:
        skill.yearsOfExperience || 0,
      description: skill.description || ''
    };

    this.clearMessages();
  }

  closeForm(): void {

    this.showForm = false;
    this.isEditMode = false;
    this.selectedSkillId = null;

    this.resetForm();
  }

  async saveSkill(): Promise<void> {

    this.clearMessages();

    if (!this.skillForm.skillName.trim()) {

      this.errorMessage =
        'Please enter a skill name.';

      return;
    }

    if (this.skillForm.yearsOfExperience < 0) {

      this.errorMessage =
        'Years of experience cannot be negative.';

      return;
    }

    this.saving = true;

    try {

      if (this.isEditMode && this.selectedSkillId) {

        const response =
          await this.apiService.put<any>(
            `/skills/${this.selectedSkillId}`,
            this.skillForm
          );

        console.log(
          'Skill update response:',
          response
        );

        this.successMessage =
          'Skill updated successfully.';

      } else {

        const response =
          await this.apiService.post<any>(
            '/skills',
            this.skillForm
          );

        console.log(
          'Skill create response:',
          response
        );

        this.successMessage =
          'Skill added successfully.';
      }

      this.closeForm();

      await this.loadSkills();

    } catch (error: any) {

      console.error(
        'Save skill error:',
        error
      );

      this.errorMessage =
        error?.error?.message ||
        error?.message ||
        'Unable to save skill.';

    } finally {

      this.saving = false;
    }
  }

  async deleteSkill(skill: Skill): Promise<void> {

    if (!skill.id) {
      return;
    }

    const confirmed =
      window.confirm(
        `Are you sure you want to delete "${skill.skillName}"?`
      );

    if (!confirmed) {
      return;
    }

    this.clearMessages();
    this.loading = true;

    try {

      await this.apiService.delete<any>(
        `/skills/${skill.id}`
      );

      this.successMessage =
        'Skill deleted successfully.';

      await this.loadSkills();

    } catch (error: any) {

      console.error(
        'Delete skill error:',
        error
      );

      this.errorMessage =
        error?.error?.message ||
        error?.message ||
        'Unable to delete skill.';

      this.loading = false;
    }
  }

  getSkillCount(): number {
    return this.skills.length;
  }

  getExpertCount(): number {

    return this.skills.filter(
      skill => skill.level === 'Expert'
    ).length;
  }

  getAdvancedCount(): number {

    return this.skills.filter(
      skill => skill.level === 'Advanced'
    ).length;
  }

  getBeginnerCount(): number {

    return this.skills.filter(
      skill => skill.level === 'Beginner'
    ).length;
  }

  getLevelClass(level: string): string {

    switch (level) {

      case 'Expert':
        return 'expert';

      case 'Advanced':
        return 'advanced';

      case 'Intermediate':
        return 'intermediate';

      default:
        return 'beginner';
    }
  }

  private resetForm(): void {

    this.skillForm = {
      skillName: '',
      category: '',
      level: 'Beginner',
      yearsOfExperience: 0,
      description: ''
    };

    this.selectedSkillId = null;
  }

  private clearMessages(): void {

    this.errorMessage = '';
    this.successMessage = '';
  }
}