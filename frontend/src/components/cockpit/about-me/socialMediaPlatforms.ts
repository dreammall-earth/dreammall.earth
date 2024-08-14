import { SocialMediaType } from '#stores/userStore.js'

export type SocialMediaPlatform = {
  type: SocialMediaType
  icon: string
  url: string
}

export const socialMediaPlatforms: SocialMediaPlatform[] = [
  {
    type: 'discord',
    icon: '$discord',
    url: 'https://discord.com/users/',
  },
  {
    type: 'telegram',
    icon: '$telegram',
    url: 'https://t.me/',
  },
  {
    type: 'snapchat',
    icon: 'mdi mdi-snapchat',
    url: 'https://snapchat.com/add/',
  },
  {
    type: 'reddit',
    icon: 'mdi mdi-reddit',
    url: 'https://reddit.com/user/',
  },
  {
    type: 'whatsapp',
    icon: 'mdi mdi-whatsapp',
    url: 'https://wa.me/',
  },
  {
    type: 'xing',
    icon: '$xing',
    url: 'https://xing.com/profile/',
  },
  {
    type: 'pintarest',
    icon: 'mdi mdi-pinterest',
    url: 'https://pinterest.com/',
  },
  {
    type: 'facebook',
    icon: 'mdi mdi-facebook',
    url: 'https://facebook.com/',
  },
  {
    type: 'instagram',
    icon: 'mdi mdi-instagram',
    url: 'https://instagram.com/',
  },
  {
    type: 'linkedin',
    icon: 'mdi mdi-linkedin',
    url: 'https://linkedin.com/in/',
  },
  {
    type: 'youtube',
    icon: 'mdi mdi-youtube',
    url: 'https://youtube.com/channel/',
  },
  {
    type: 'tiktok',
    icon: '$tiktok',
    url: 'https://tiktok.com/@',
  },
  {
    type: 'x',
    icon: '$x',
    url: 'https://x.com/',
  },
]

export const socialMediaTypes = socialMediaPlatforms.map((platform) => platform.type)

export const getSocialMediaIcon = (type: SocialMediaType) => {
  const platform = socialMediaPlatforms.find((platform) => platform.type === type)
  return platform?.icon
}

export const buildSocialMediaLink = (type: SocialMediaType, username: string) => {
  const platform = socialMediaPlatforms.find((platform) => platform.type === type)
  return platform?.url + username
}
