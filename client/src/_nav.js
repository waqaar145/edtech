export default {
  items: [
    {
      name: 'Dashboard',
      url: '/dashboard',
      icon: 'icon-speedometer'
    },
    {
      name: 'Top Level',
      url: '/base',
      icon: 'icon-puzzle',
      children: [
        {
          name: 'Semesters',
          url: '/admin/semesters',
          icon: 'icon-puzzle',
        },
        {
          name: 'Subjects',
          url: '/admin/subjects',
          icon: 'icon-puzzle',
        },
        {
          name: 'Chapters',
          url: '/admin/chapters',
          icon: 'icon-puzzle',
        },
        {
          name: 'Contents',
          url: '/admin/contents',
          icon: 'icon-puzzle',
        },
      ]
    },
    {
      name: 'Blogs',
      url: '/base',
      icon: 'icon-puzzle',
      children: [
        {
          name: 'Categories',
          url: '/admin/blogs/categories',
          icon: 'icon-puzzle',
        },
        {
          name: 'Blogs',
          url: '/admin/blogs',
          icon: 'icon-puzzle',
        },
      ]
    }

  ],
};
