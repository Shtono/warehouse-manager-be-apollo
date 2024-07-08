import axios from 'axios'
import { REST_BE_URL } from '../config/environment'

export type CheckWarehouseCapacityResponse = {
  isAvailableCapacity: boolean
  containerSize: number
  updatedCurrentCapacity: number
}

type CheckCapacityBody = {
  quantity: number
  productSize: number
  warehouseCurrentCapacity: number
  warehouseMaxCapacity: number
}

type UpdateWarehouseCapacityResponse = { updated_current_capacity: number }

type UpdateCapacityBody = {
  currentCapacity: number
  containerSize: number
}

export const checkCapacity = async ({
  quantity,
  productSize,
  warehouseCurrentCapacity,
  warehouseMaxCapacity,
}: CheckCapacityBody): Promise<CheckWarehouseCapacityResponse> => {
  try {
    const { data } = await axios.post(
      `${REST_BE_URL}/add-stock-to-warehouse`,
      {
        quantity,
        product_size: productSize,
        warehouse_current_capacity: warehouseCurrentCapacity,
        warehouse_max_capacity: warehouseMaxCapacity,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )
    return data
  } catch (err) {
    // @ts-ignore
    throw new Error(err.error ?? 'Could not check capacity')
  }
}

export const updateWarehouseCapacity = async ({
  currentCapacity,
  containerSize,
}: UpdateCapacityBody): Promise<UpdateWarehouseCapacityResponse> => {
  try {
    const { data } = await axios.post(
      `${REST_BE_URL}/update-warehouse-capacity`,
      {
        current_capacity: currentCapacity,
        container_size: containerSize,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )
    return data
  } catch (err) {
    // @ts-ignore
    throw new Error(err.error ?? 'Could not update capacity')
  }
}
