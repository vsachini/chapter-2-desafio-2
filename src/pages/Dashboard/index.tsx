import { useEffect, useState } from 'react'
import { Food, IFood } from '../../components/Food'
import { Header } from '../../components/Header'
import { ModalAddFood } from '../../components/ModalAddFood'
import { ModalEditFood } from '../../components/ModalEditFood'
import api from '../../services/api'
import { FoodsContainer } from './styles'

export function Dashboard() {
  const [foods, setFoods] = useState<IFood[]>([])
  const [editingFood, setEditingFood] = useState<IFood>({} as IFood)
  const [modalOpen, setModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)

  useEffect(() => {
    async function fetchFood() {
      const response = await api.get('/foods')
      setFoods(response.data)
    }

    fetchFood()
  }, [])

  const handleAddFood = async (food: IFood) => {
    try {
      const response = await api.post('/foods', {
        ...food,
        available: true,
      })

      setFoods((prev: IFood[]) => [...prev, response.data])
    } catch (err) {
      console.log(err)
    }
  }

  const handleUpdateFood = async (food: IFood) => {
    try {
      const foodUpdated = await api.put(`/foods/${editingFood.id}`, { ...editingFood, ...food })

      const foodsUpdated = foods.map((f) => (f.id !== foodUpdated.data.id ? f : foodUpdated.data))

      setFoods(foodsUpdated)
    } catch (err) {
      console.log(err)
    }
  }

  const handleDeleteFood = async (id: number) => {
    await api.delete(`/foods/${id}`)

    const foodsFiltered = foods.filter((food) => food.id !== id)
    setFoods(foodsFiltered)
  }

  const toggleModal = () => {
    setModalOpen((prev) => !prev)
  }

  const toggleEditModal = () => {
    setEditModalOpen((prev) => !prev)
  }

  const handleEditFood = (food: IFood) => {
    setEditingFood(food)
    setEditModalOpen(true)
  }

  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood isOpen={modalOpen} setIsOpen={toggleModal} handleAddFood={handleAddFood} />
      <ModalEditFood
        isOpen={editModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map((food) => (
            <Food key={food.id} food={food} handleDelete={handleDeleteFood} handleEditFood={handleEditFood} />
          ))}
      </FoodsContainer>
    </>
  )
}
