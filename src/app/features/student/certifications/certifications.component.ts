import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ApiService } from '../../../core/services/api.service';

interface Certification {
  id?: string;
  name: string;
  issuingOrganization: string;
  issueDate: string | null;
  expiryDate: string | null;
  credentialId: string;
  credentialUrl: string;
  description: string;
  studentId?: string;
  createdAt?: any;
  updatedAt?: any;
}

@Component({
  selector: 'app-certifications',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './certifications.component.html',
  styleUrl: './certifications.component.css'
})
export class CertificationsComponent implements OnInit {

  certifications: Certification[] = [];

  loading = false;
  saving = false;

  errorMessage = '';
  successMessage = '';

  showForm = false;
  isEditMode = false;

  selectedCertificationId: string | null = null;

  certificationForm: Certification = {
    name: '',
    issuingOrganization: '',
    issueDate: null,
    expiryDate: null,
    credentialId: '',
    credentialUrl: '',
    description: ''
  };

  constructor(
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.loadCertifications();
  }

  async loadCertifications(): Promise<void> {

    this.loading = true;
    this.errorMessage = '';

    try {

      const response =
        await this.apiService.get<any>(
          '/certifications/me'
        );

      console.log(
        'Certifications response:',
        response
      );

      this.certifications =
        response?.data || [];

    } catch (error: any) {

      console.error(
        'Load certifications error:',
        error
      );

      this.certifications = [];

      this.errorMessage =
        error?.error?.message ||
        error?.message ||
        'Unable to load certifications.';

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

  openEditForm(
    certification: Certification
  ): void {

    this.isEditMode = true;
    this.showForm = true;

    this.selectedCertificationId =
      certification.id || null;

    this.certificationForm = {
      name: certification.name || '',

      issuingOrganization:
        certification.issuingOrganization || '',

      issueDate:
        this.formatDateForInput(
          certification.issueDate
        ),

      expiryDate:
        this.formatDateForInput(
          certification.expiryDate
        ),

      credentialId:
        certification.credentialId || '',

      credentialUrl:
        certification.credentialUrl || '',

      description:
        certification.description || ''
    };

    this.clearMessages();
  }

  closeForm(): void {

    this.showForm = false;
    this.isEditMode = false;
    this.selectedCertificationId = null;

    this.resetForm();
  }

  async saveCertification(): Promise<void> {

    this.clearMessages();

    if (!this.certificationForm.name.trim()) {

      this.errorMessage =
        'Please enter certification name.';

      return;
    }

    if (
      !this.certificationForm.issuingOrganization.trim()
    ) {

      this.errorMessage =
        'Please enter issuing organization.';

      return;
    }

    if (
      this.certificationForm.issueDate &&
      this.certificationForm.expiryDate &&
      this.certificationForm.expiryDate <
      this.certificationForm.issueDate
    ) {

      this.errorMessage =
        'Expiry date cannot be before issue date.';

      return;
    }

    this.saving = true;

    try {

      const data = {
        name:
          this.certificationForm.name.trim(),

        issuingOrganization:
          this.certificationForm
            .issuingOrganization
            .trim(),

        issueDate:
          this.certificationForm.issueDate || null,

        expiryDate:
          this.certificationForm.expiryDate || null,

        credentialId:
          this.certificationForm
            .credentialId
            .trim(),

        credentialUrl:
          this.certificationForm
            .credentialUrl
            .trim(),

        description:
          this.certificationForm
            .description
            .trim()
      };

      if (
        this.isEditMode &&
        this.selectedCertificationId
      ) {

        const response =
          await this.apiService.put<any>(
            `/certifications/${this.selectedCertificationId}`,
            data
          );

        console.log(
          'Certification update response:',
          response
        );

        this.successMessage =
          'Certification updated successfully.';

      } else {

        const response =
          await this.apiService.post<any>(
            '/certifications',
            data
          );

        console.log(
          'Certification create response:',
          response
        );

        this.successMessage =
          'Certification added successfully.';
      }

      this.closeForm();

      await this.loadCertifications();

    } catch (error: any) {

      console.error(
        'Save certification error:',
        error
      );

      this.errorMessage =
        error?.error?.message ||
        error?.message ||
        'Unable to save certification.';

    } finally {

      this.saving = false;
    }
  }

  async deleteCertification(
    certification: Certification
  ): Promise<void> {

    if (!certification.id) {
      return;
    }

    const confirmed =
      window.confirm(
        `Are you sure you want to delete "${certification.name}"?`
      );

    if (!confirmed) {
      return;
    }

    this.clearMessages();
    this.loading = true;

    try {

      await this.apiService.delete<any>(
        `/certifications/${certification.id}`
      );

      this.successMessage =
        'Certification deleted successfully.';

      await this.loadCertifications();

    } catch (error: any) {

      console.error(
        'Delete certification error:',
        error
      );

      this.errorMessage =
        error?.error?.message ||
        error?.message ||
        'Unable to delete certification.';

      this.loading = false;
    }
  }

  getTotalCertifications(): number {
    return this.certifications.length;
  }

  getActiveCertifications(): number {

    return this.certifications.filter(
      certification =>
        !this.isExpired(certification)
    ).length;
  }

  getExpiredCertifications(): number {

    return this.certifications.filter(
      certification =>
        this.isExpired(certification)
    ).length;
  }

  isExpired(
    certification: Certification
  ): boolean {

    if (!certification.expiryDate) {
      return false;
    }

    const expiryDate =
      new Date(certification.expiryDate);

    return expiryDate < new Date();
  }

  getStatus(
    certification: Certification
  ): string {

    if (!certification.expiryDate) {
      return 'No Expiry';
    }

    if (this.isExpired(certification)) {
      return 'Expired';
    }

    return 'Active';
  }

  getStatusClass(
    certification: Certification
  ): string {

    if (!certification.expiryDate) {
      return 'no-expiry';
    }

    if (this.isExpired(certification)) {
      return 'expired';
    }

    return 'active';
  }

  formatDate(
    date: string | null
  ): string {

    if (!date) {
      return 'Not specified';
    }

    const parsedDate =
      new Date(date);

    if (isNaN(parsedDate.getTime())) {
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

    if (isNaN(parsedDate.getTime())) {
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

    this.certificationForm = {
      name: '',
      issuingOrganization: '',
      issueDate: null,
      expiryDate: null,
      credentialId: '',
      credentialUrl: '',
      description: ''
    };

    this.selectedCertificationId = null;
  }

  private clearMessages(): void {

    this.errorMessage = '';
    this.successMessage = '';
  }
}