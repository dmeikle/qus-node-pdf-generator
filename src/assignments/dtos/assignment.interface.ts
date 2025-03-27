/*
 * MIT License
 * 
 * Copyright (c) 2024 Quantum Unit Solutions
 * Author: David Meikle
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
import {RubricInterface} from "../../rubrics/dtos/rubric.interface";

export interface AssignmentInterface {
    id: string;
    name: string;
    description: string;
    createdAtRemote: string;
    updatedAtRemote: string;
    dueAt: string | null;
    lockAt: string | null;
    unlockAt: string | null;
    hasOverrides: boolean;
    courseId: number;
    htmlUrl: string;
    submissionsDownloadUrl: string;
    assignmentGroupId: number;
    dueDateRequired: boolean;
    maxNameLength: number;
    gradeGroupStudentsIndividually: boolean;
    peerReviews: boolean;
    automaticPeerReviews: boolean;
    intraGroupPeerReviews: boolean;
    groupCategoryId: number;
    needsGradingCount: number;
    position: number;
    postToSis: boolean;
    integrationId: string;
    integrationData: Record<string, string>;
    pointsPossible: number;
    submissionTypes: string[];
    hasSubmittedSubmissions: boolean;
    gradingType: string;
    gradingStandardId: any | null;
    published: boolean;
    unpublishable: boolean;
    onlyVisibleToOverrides: boolean;
    lockedForUser: boolean;
    useRubricForGrading: boolean;
    rubricSettings: Record<string, any>;
    rubric: RubricInterface | null;
    omitFromFinalGrade: boolean;
    hideInGradebook: boolean;
    moderatedGrading: boolean;
    graderCount: number;
    finalGraderId: number;
    graderCommentsVisibleToGraders: boolean;
    gradersAnonymousToGraders: boolean;
    graderNamesVisibleToFinalGrader: boolean;
    anonymousGrading: boolean;
    allowedAttempts: number;
    postManually: boolean;
    annotatableAttachmentId: any | null;
    anonymizeStudents: boolean;
    requireLockdownBrowser: boolean;
    importantDates: boolean;
    muted: boolean;
    anonymousPeerReviews: boolean;
    anonymousInstructorAnnotations: boolean;
    gradedSubmissionsExist: boolean;
    isQuizAssignment: boolean;
    inClosedGradingPeriod: boolean;
    canDuplicate: boolean;
    originalCourseId: number;
    originalAssignmentId: number;
    originalLtiResourceLinkId: number;
    originalAssignmentName: string;
    originalQuizId: number;
    workflowState: string;
    secureParams: string;
    ltiContextId: string;
    learningGoals: string;
    assignmentNumber: number;
}


