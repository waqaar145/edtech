import React from 'react';
const Dashboard = React.lazy(() => import('./views/Dashboard'));
// Semesters
const SemestersList = React.lazy(() => import('./views/Semesters/list'));
const CreateSemester = React.lazy(() => import('./views/Semesters/create'));
// Subjects
const SubjectsList = React.lazy(() => import('./views/Subjects/list'));
const CreateSubject = React.lazy(() => import('./views/Subjects/create'));
// Chapters
const ChaptersList = React.lazy(() => import('./views/Chapters/list'));
const CreateChapter = React.lazy(() => import('./views/Chapters/create'));
// Contents
const ContentsList = React.lazy(() => import('./views/Contents/list'));
const CreateContent = React.lazy(() => import('./views/Contents/create'));
// Blog category
const BlogCategoriesList = React.lazy(() => import('./views/Blogs/Category/list'));
const CreateBlogCategory = React.lazy(() => import('./views/Blogs/Category/create'));

const BlogList = React.lazy(() => import('./views/Blogs/list'));
const CreateBlog = React.lazy(() => import('./views/Blogs/create'));


const routes = [
  // { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard },
  // Semesters
  { path: '/admin/semesters', name: 'Semesters', component: SemestersList },
  { path: '/admin/semester/create', name: 'Create Semester', component: CreateSemester },
  { path: '/admin/semester/edit/:semester_slug', name: 'Edit Semester', component: CreateSemester },
  // Chapters
  { path: '/admin/subjects', name: 'Subjects', component: SubjectsList },
  { path: '/admin/subject/create', name: 'Create Subject', component: CreateSubject },
  { path: '/admin/subject/edit/:subject_slug', name: 'Edit Subject', component: CreateSubject },
  // Chapters
  { path: '/admin/chapters', name: 'Chapters', component: ChaptersList },
  { path: '/admin/chapter/create', name: 'Create Chapters', component: CreateChapter },
  { path: '/admin/chapter/edit/:chapter_slug', name: 'Edit Chapter', component: CreateChapter },
  // Contents
  { path: '/admin/contents', name: 'Contents', component: ContentsList },
  { path: '/admin/content/create', name: 'Create Content', component: CreateContent },
  { path: '/admin/content/edit/:content_slug', name: 'Edit Content', component: CreateContent },
  // Blogs - category
  { path: '/admin/blogs/categories', name: 'Blog - Categories list', component: BlogCategoriesList },
  { path: '/admin/blogs/category/create', name: 'Blog - Create category', component: CreateBlogCategory },
  { path: '/admin/blogs/category/edit/:category_slug', name: 'Blog - Edit category', component: CreateBlogCategory },
  // categories -
  { path: '/admin/blogs', name: 'Blogs', component: BlogList },
  { path: '/admin/blog/create', name: 'Create Blog', component: CreateBlog },
  { path: '/admin/blog/edit/:blog_slug', name: 'Edit Chapter', component: CreateBlog },
];

export default routes;
