export interface CreateMeetingResponse {
  returncode: string
  meetingID: string
  internalMeetingID: string
  parentMeetingID: string
  attendeePW: string
  moderatorPW: string
  createTime: number
  voiceBridge: number
  dialNumber: string
  createDate: Date
  hasUserJoined: boolean
  duration: number
  hasBeenForciblyEnded: boolean
  messageKey: string
  message: string
}

export type AttendeeInfo = {
  userID: string
  fullName: string
  role: string
  isPresenter: boolean
  isListeningOnly: boolean
  hasJoinedVoice: boolean
  hasVideo: boolean
  clientType: string
}

export type MeetingInfo = {
  meetingName: string
  meetingID: string
  internalMeetingID: string
  createTime: number
  createDate: Date
  voiceBridge: number
  dialNumber: string
  attendeePW: string
  moderatorPW: string
  running: boolean
  duration: number
  hasUserJoined: boolean
  recording: boolean
  hasBeenForciblyEnded: boolean
  startTime: number
  endTime: number
  participantCount: number
  listenerCount: number
  voiceParticipantCount: number
  videoCount: number
  maxUsers: number
  moderatorCount: number
  attendees: string | { attendee: AttendeeInfo[] | AttendeeInfo }
  metadata: string
  isBreakout: boolean
}

export type GetMeetingsResponse = {
  returncode: string
  meetings: { meeting: MeetingInfo[] } | string
}

export interface CreateMeetingOptions {
  name: string
  meetingID: string
  // welcome?: string
}

export interface JoinMeetinLinkOptions {
  fullName: string
  meetingID: string
  role?: 'MODERATOR' | 'VIEWER'
  password?: string
  createTime?: string
  userID?: string
}
