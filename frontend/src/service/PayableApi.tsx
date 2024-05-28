import { TPayable } from '../types/PayableType'

const URL = 'http://localhost:3000/integrations/payable'
const TOKEN_STORAGED = localStorage.getItem('token')

export const CreatePayableApi = async (data: TPayable) => {
  const response = await fetch(URL,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${TOKEN_STORAGED}`
      },
      body: JSON.stringify(data)
    }
  )
  return response.json()
}

export const GetAllPayablesApi = async () => {
  const response = await fetch(URL,
    {
      headers: {
        'Authorization': `Bearer ${TOKEN_STORAGED}`
      }
    }
  )
  return response.json()
}

export const GetPayableByIdApi = async (id: string) => {
  const response = await fetch(`${URL}/${id}`,
  {
    headers: {
      'Authorization': `Bearer ${TOKEN_STORAGED}`
    }
  }
)
const as = await response.json()
return as
}

export const UpdatePayableApi = async (id: string, data: TPayable) => {
  const response = await fetch(`${URL}/${id}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${TOKEN_STORAGED}`
      },
      body: JSON.stringify(data)
    }
  )
  return response.json()
}

export const DeletePayableApi = async (id: string) => {
  try {
    await fetch(`${URL}/${id}`,
      {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${TOKEN_STORAGED}`
        }
      }
    )
  } catch (error) {
    console.log(error)
  } 
}
