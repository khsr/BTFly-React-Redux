export const PUSH_TEMP_NOTE = 'moodNotes/PUSH_TEMP_NOTE'
export const POP_TEMP_NOTE = 'moodNotes/POP_TEMP_NOTE'

export function pushTempNote (boxId, tempNote) {
  return {
    type: PUSH_TEMP_NOTE,
    payload: { boxId, tempNote }
  }
}

export function popTempNote (boxId, tempNoteId) {
  return {
    type: POP_TEMP_NOTE,
    payload: { boxId, tempNoteId }
  }
}
