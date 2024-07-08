export interface SocialEntry {
  type: 'github' | 'twitter' | 'email'
  icon: string
  link: string
}

export interface Creator {
  avatar: string
  name: string
  username?: string
  title?: string
  org?: string
  desc?: string
  links?: SocialEntry[]
  nameAliases?: string[]
  emailAliases?: string[]
}

const getAvatarUrl = (name: string) => `https://avatars.githubusercontent.com/u/148983604?s=400&u=42e68d5de19c21b7bc245717fc7a883f341a4521&v=4`

export const creators: Creator[] = [
  {
    name: 'Samuel是不是好奇猫',
    avatar: '',
    username: 'SamuelNOTCuriousMeow',
    title: '《诺文斯克潜行者》整合者',
    desc: '臭打游戏的，MOD玩家，AI高强度依赖者',
    links: [
      { type: 'github', icon: 'github', link: 'https://github.com/windersvista' },
    ],
    nameAliases: ['windersvista', '好奇猫', 'Samuel'],
    emailAliases: ['xinxin.ily@gmail.com'],
  }
].map<Creator>((c) => {
  c.avatar = c.avatar || getAvatarUrl(c.username)
  return c as Creator
})

export const creatorNames = creators.map(c => c.name)
export const creatorUsernames = creators.map(c => c.username || '')
