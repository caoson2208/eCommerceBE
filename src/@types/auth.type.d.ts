export interface Register {
  email: string
  password: string
  name: string
  date_of_birth: string
  address: string
  phone: string
}

export interface Login {
  email: string
  password: string
}

export interface PayloadToken {
  id: string
  email: string
  roles: string[]
  created_at: string
}

export interface Token {
  tokens: string[]
}
