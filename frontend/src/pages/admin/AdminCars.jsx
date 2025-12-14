import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { carService } from '../../services/carService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import Modal from '../../components/common/Modal';
import Badge from '../../components/common/Badge';
import { useForm } from 'react-hook-form';
import { FiEdit, FiTrash2, FiPlus, FiX } from 'react-icons/fi';
import { toast } from 'react-toastify';

const AdminCars = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCar, setEditingCar] = useState(null);
  const queryClient = useQueryClient();

  const { data: cars, isLoading, error } = useQuery({
    queryKey: ['admin-cars'],
    queryFn: () => carService.getAllCars(),
  });

  const createMutation = useMutation({
    mutationFn: (data) => carService.createCar(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-cars']);
      toast.success('Voiture créée avec succès');
      setIsModalOpen(false);
      reset();
    },
    onError: () => {
      toast.error('Erreur lors de la création');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => carService.updateCar(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-cars']);
      toast.success('Voiture modifiée avec succès');
      setIsModalOpen(false);
      setEditingCar(null);
      reset();
    },
    onError: () => {
      toast.error('Erreur lors de la modification');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => carService.deleteCar(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-cars']);
      toast.success('Voiture supprimée avec succès');
    },
    onError: () => {
      toast.error('Erreur lors de la suppression');
    },
  });

  const availabilityMutation = useMutation({
    mutationFn: ({ id, available }) =>
      carService.updateAvailability(id, available),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-cars']);
      toast.success('Disponibilité mise à jour');
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = (data) => {
    if (editingCar) {
      updateMutation.mutate({ id: editingCar.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (car) => {
    setEditingCar(car);
    reset(car);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette voiture ?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleNew = () => {
    setEditingCar(null);
    reset({
      brand: '',
      model: '',
      year: new Date().getFullYear(),
      pricePerDay: 0,
      categorie: 'ECONOMIQUE',
      disponible: true,
      immatriculation: '',
    });
    setIsModalOpen(true);
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Gestion des voitures</h1>
        <button onClick={handleNew} className="btn-primary flex items-center gap-2">
          <FiPlus className="w-5 h-5" />
          <span>Ajouter une voiture</span>
        </button>
      </div>

      {isLoading ? (
        <LoadingSpinner size="lg" className="py-12" />
      ) : error ? (
        <ErrorMessage message="Erreur lors du chargement" />
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Voiture
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Catégorie
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Prix/jour
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Disponibilité
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {cars?.map((car) => (
                <tr key={car.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {car.brand} {car.model}
                    </div>
                    <div className="text-sm text-gray-500">{car.year}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge
                      variant={
                        car.categorie === 'LUXE'
                          ? 'warning'
                          : car.categorie === 'CONFORT'
                          ? 'primary'
                          : 'default'
                      }
                    >
                      {car.categorie}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Intl.NumberFormat('fr-FR', {
                      style: 'currency',
                      currency: 'EUR',
                    }).format(car.pricePerDay)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() =>
                        availabilityMutation.mutate({
                          id: car.id,
                          available: !car.disponible,
                        })
                      }
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        car.disponible
                          ? 'bg-success text-white'
                          : 'bg-danger text-white'
                      }`}
                    >
                      {car.disponible ? 'Disponible' : 'Indisponible'}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleEdit(car)}
                        className="text-primary hover:text-blue-600"
                      >
                        <FiEdit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(car.id)}
                        className="text-danger hover:text-red-600"
                      >
                        <FiTrash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingCar(null);
          reset();
        }}
        title={editingCar ? 'Modifier la voiture' : 'Ajouter une voiture'}
        size="lg"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Marque *
              </label>
              <input
                type="text"
                {...register('brand', { required: 'La marque est requise' })}
                className="input-field"
              />
              {errors.brand && (
                <p className="text-danger text-sm mt-1">{errors.brand.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Modèle *
              </label>
              <input
                type="text"
                {...register('model', { required: 'Le modèle est requis' })}
                className="input-field"
              />
              {errors.model && (
                <p className="text-danger text-sm mt-1">{errors.model.message}</p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Année *
              </label>
              <input
                type="number"
                {...register('year', {
                  required: "L'année est requise",
                  valueAsNumber: true,
                })}
                className="input-field"
              />
              {errors.year && (
                <p className="text-danger text-sm mt-1">{errors.year.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prix par jour (€) *
              </label>
              <input
                type="number"
                step="0.01"
                {...register('pricePerDay', {
                  required: 'Le prix est requis',
                  valueAsNumber: true,
                })}
                className="input-field"
              />
              {errors.pricePerDay && (
                <p className="text-danger text-sm mt-1">
                  {errors.pricePerDay.message}
                </p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Immatriculation *
              </label>
              <input
                type="text"
                {...register('immatriculation', {
                  required: "L'immatriculation est requise",
                  valueAsNumber: false,
                })}
                className="input-field"
              />
              {errors.immatriculation && (
                <p className="text-danger text-sm mt-1">
                  {errors.immatriculation.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Catégorie *
              </label>
              <select
                {...register('categorie', { required: 'La catégorie est requise' })}
                className="input-field"
              >
                <option value="ECONOMIQUE">Économique</option>
                <option value="CONFORT">Confort</option>
                <option value="LUXE">Luxe</option>
              </select>
            </div>
          </div>
          <div className="flex gap-4">
            <button type="submit" className="btn-primary flex-1">
              {editingCar ? 'Modifier' : 'Créer'}
            </button>
            <button
              type="button"
              onClick={() => {
                setIsModalOpen(false);
                setEditingCar(null);
                reset();
              }}
              className="btn-secondary flex-1"
            >
              Annuler
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminCars;

