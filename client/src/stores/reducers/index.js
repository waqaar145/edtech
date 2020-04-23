import { combineReducers } from 'redux';
import User from './userReducers'
import Semester from './semesterReducers'
import Subject from './subjectReducers'
import Chapter from './chapterReducers'
import Content from './contentReducers'
import Blog from './blogReducers'


export default combineReducers({
  User,
  Semester,
  Subject,
  Chapter,
  Content,
  Blog
});
