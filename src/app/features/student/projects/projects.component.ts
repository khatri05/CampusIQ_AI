import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ApiService } from '../../../core/services/api.service';

interface Project {
  id?: string;
  projectName: string;
  description: string;
  category: string;
  technologies: string[];
  role: string;
  startDate: string | null;
  endDate: string | null;
  projectUrl: string;
  githubUrl: string;
  teamSize: number;
  status: 'Planned' | 'In Progress' | 'Completed';
  studentId?: string;
  createdAt?: any;
  updatedAt?: any;
}

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.css'
})
export class ProjectsComponent implements OnInit {

  projects: Project[] = [];

  loading = false;
  saving = false;

  errorMessage = '';
  successMessage = '';

  showForm = false;
  isEditMode = false;

  selectedProjectId: string | null = null;

  technologyInput = '';

  projectForm: Project = {
    projectName: '',
    description: '',
    category: '',
    technologies: [],
    role: '',
    startDate: null,
    endDate: null,
    projectUrl: '',
    githubUrl: '',
    teamSize: 1,
    status: 'Planned'
  };

  statuses = [
    'Planned',
    'In Progress',
    'Completed'
  ];

  constructor(
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.loadProjects();
  }

  async loadProjects(): Promise<void> {

    this.loading = true;
    this.errorMessage = '';

    try {

      const response =
        await this.apiService.get<any>(
          '/projects/me'
        );

      console.log(
        'Projects response:',
        response
      );

      this.projects =
        response?.data || [];

    } catch (error: any) {

      console.error(
        'Load projects error:',
        error
      );

      this.projects = [];

      this.errorMessage =
        error?.error?.message ||
        error?.message ||
        'Unable to load projects.';

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

  openEditForm(project: Project): void {

    this.isEditMode = true;
    this.showForm = true;

    this.selectedProjectId =
      project.id || null;

    this.projectForm = {
      projectName:
        project.projectName || '',

      description:
        project.description || '',

      category:
        project.category || '',

      technologies:
        Array.isArray(project.technologies)
          ? [...project.technologies]
          : [],

      role:
        project.role || '',

      startDate:
        this.formatDateForInput(
          project.startDate
        ),

      endDate:
        this.formatDateForInput(
          project.endDate
        ),

      projectUrl:
        project.projectUrl || '',

      githubUrl:
        project.githubUrl || '',

      teamSize:
        project.teamSize || 1,

      status:
        project.status || 'Planned'
    };

    this.technologyInput = '';

    this.clearMessages();
  }

  closeForm(): void {

    this.showForm = false;
    this.isEditMode = false;
    this.selectedProjectId = null;

    this.resetForm();
  }

  addTechnology(): void {

    const technology =
      this.technologyInput.trim();

    if (!technology) {
      return;
    }

    const alreadyExists =
      this.projectForm.technologies
        .some(
          item =>
            item.toLowerCase() ===
            technology.toLowerCase()
        );

    if (!alreadyExists) {

      this.projectForm.technologies.push(
        technology
      );
    }

    this.technologyInput = '';
  }

  removeTechnology(index: number): void {

    this.projectForm.technologies.splice(
      index,
      1
    );
  }

  handleTechnologyKey(
    event: KeyboardEvent
  ): void {

    if (event.key === 'Enter') {

      event.preventDefault();

      this.addTechnology();
    }
  }

  async saveProject(): Promise<void> {

    this.clearMessages();

    if (
      !this.projectForm.projectName.trim()
    ) {

      this.errorMessage =
        'Please enter project name.';

      return;
    }

    if (
      this.projectForm.startDate &&
      this.projectForm.endDate &&
      this.projectForm.endDate <
      this.projectForm.startDate
    ) {

      this.errorMessage =
        'End date cannot be before start date.';

      return;
    }

    if (
      this.projectForm.teamSize < 1
    ) {

      this.errorMessage =
        'Team size must be at least 1.';

      return;
    }

    this.saving = true;

    try {

      const data = {
        projectName:
          this.projectForm.projectName.trim(),

        description:
          this.projectForm.description.trim(),

        category:
          this.projectForm.category.trim(),

        technologies:
          this.projectForm.technologies,

        role:
          this.projectForm.role.trim(),

        startDate:
          this.projectForm.startDate || null,

        endDate:
          this.projectForm.endDate || null,

        projectUrl:
          this.projectForm.projectUrl.trim(),

        githubUrl:
          this.projectForm.githubUrl.trim(),

        teamSize:
          Number(this.projectForm.teamSize),

        status:
          this.projectForm.status
      };

      if (
        this.isEditMode &&
        this.selectedProjectId
      ) {

        const response =
          await this.apiService.put<any>(
            `/projects/${this.selectedProjectId}`,
            data
          );

        console.log(
          'Project update response:',
          response
        );

        this.successMessage =
          'Project updated successfully.';

      } else {

        const response =
          await this.apiService.post<any>(
            '/projects',
            data
          );

        console.log(
          'Project create response:',
          response
        );

        this.successMessage =
          'Project added successfully.';
      }

      this.closeForm();

      await this.loadProjects();

    } catch (error: any) {

      console.error(
        'Save project error:',
        error
      );

      this.errorMessage =
        error?.error?.message ||
        error?.message ||
        'Unable to save project.';

    } finally {

      this.saving = false;
    }
  }

  async deleteProject(
    project: Project
  ): Promise<void> {

    if (!project.id) {
      return;
    }

    const confirmed =
      window.confirm(
        `Are you sure you want to delete "${project.projectName}"?`
      );

    if (!confirmed) {
      return;
    }

    this.clearMessages();
    this.loading = true;

    try {

      await this.apiService.delete<any>(
        `/projects/${project.id}`
      );

      this.successMessage =
        'Project deleted successfully.';

      await this.loadProjects();

    } catch (error: any) {

      console.error(
        'Delete project error:',
        error
      );

      this.errorMessage =
        error?.error?.message ||
        error?.message ||
        'Unable to delete project.';

      this.loading = false;
    }
  }

  getTotalProjects(): number {
    return this.projects.length;
  }

  getCompletedProjects(): number {

    return this.projects.filter(
      project =>
        project.status === 'Completed'
    ).length;
  }

  getInProgressProjects(): number {

    return this.projects.filter(
      project =>
        project.status === 'In Progress'
    ).length;
  }

  getPlannedProjects(): number {

    return this.projects.filter(
      project =>
        project.status === 'Planned'
    ).length;
  }

  getStatusClass(
    status: string
  ): string {

    switch (status) {

      case 'Completed':
        return 'completed';

      case 'In Progress':
        return 'in-progress';

      default:
        return 'planned';
    }
  }

  formatDate(
    date: string | null
  ): string {

    if (!date) {
      return 'Not specified';
    }

    const parsedDate =
      new Date(date);

    if (
      isNaN(
        parsedDate.getTime()
      )
    ) {

      return date;
    }

    return parsedDate.toLocaleDateString(
      'en-IN',
      {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }
    );
  }

  private formatDateForInput(
    date: string | null
  ): string | null {

    if (!date) {
      return null;
    }

    const parsedDate =
      new Date(date);

    if (
      isNaN(
        parsedDate.getTime()
      )
    ) {

      return date;
    }

    const year =
      parsedDate.getFullYear();

    const month =
      String(
        parsedDate.getMonth() + 1
      ).padStart(2, '0');

    const day =
      String(
        parsedDate.getDate()
      ).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  private resetForm(): void {

    this.projectForm = {
      projectName: '',
      description: '',
      category: '',
      technologies: [],
      role: '',
      startDate: null,
      endDate: null,
      projectUrl: '',
      githubUrl: '',
      teamSize: 1,
      status: 'Planned'
    };

    this.technologyInput = '';
    this.selectedProjectId = null;
  }

  private clearMessages(): void {

    this.errorMessage = '';
    this.successMessage = '';
  }
}