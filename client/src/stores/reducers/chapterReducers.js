import {GET_CHAPTERS, GET_CHAPTER_BY_SLUG, DELETE_CHAPTER_BY_ID, CLEAR_CHAPTER} from './../../types.js'
let initialState = {
  chapters: [],
  chapters_label_value: [],
  chapter: {}
}
export default function User (state = initialState, action = {}){

  switch (action.type) {
    case GET_CHAPTERS:
      let chapters_label_value = action.data.map((chapter) => {
                                  return { value: chapter.id, label: chapter.chapter_name }
                                });
      return { ...state, chapters: action.data, chapters_label_value: chapters_label_value };

    case GET_CHAPTER_BY_SLUG:
      return {...state, chapter : { ...action.data }}

    case DELETE_CHAPTER_BY_ID:
      return {...state, chapters: state.chapters.filter(chapter => chapter.id !== action.data)}

    case CLEAR_CHAPTER:
      return {...state, chapter: {}};

    default:
        return state;
  }
}
