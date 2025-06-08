'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import Image from 'next/image';

type EntradaType = {
  id: string;
  nome: string;
  categoria: string;
  preco: number;
  data_venc: Date;
  data_pag: Date;
  user_ref: string;
  image_url: string;
};

const Finan = () => {
    const [entradas, setEntradas] = useState<EntradaType[]>([]);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const [form, setForm] = useState<{ id?: string; nome: string; preco: number; data_venc: Date; data_pag: Date; user_ref: string; image_url: string }>({
      nome: '',
      preco: 0,
      data_venc: new Date(),
      data_pag: new Date(),
      user_ref: '',
      image_url: '',
    });

    useEffect(() => {
      fetchEntradas();
    }, []);

    const fetchEntradas = async () => {
      const { data, error } = await supabase.from('entradas').select('*');
      if (error) {
        console.error('Erro ao buscar entradas:', error.message);
        return;
      }
      if (data) setEntradas(data);
    }

    const handleEdit = (entrada: EntradaType) => {
      setForm(entrada);
      setImagePreview(entrada.image_url);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0] || null;
      setImageFile(file);
      if (file) {
        const reader = new FileReader();
        reader.onload = () => setImagePreview(reader.result as string);
        reader.readAsDataURL(file);
      } else {
        setImagePreview(null);
      }
    };

    const handleCancel = () => {
      setForm({ nome: '', preco: 0, data_venc: new Date(), data_pag: new Date(), user_ref: '', image_url: '' });
      setImageFile(null);
      setImagePreview(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      const { data, error } = await supabase.from('entradas').insert([form]);
      if (error) {
        console.error('Erro ao salvar entrada:', error.message);
        return;
      }
      setForm({ nome: '', preco: 0, data_venc: new Date(), data_pag: new Date(), user_ref: '', image_url: '' });
      setImageFile(null);
      setImagePreview(null);
      fetchEntradas();
    };
    
    const handleDelete = async (id: string) => {
      const { error } = await supabase.from('entradas').delete().eq('id', id);
      if (error) {
        console.error('Erro ao deletar entrada:', error.message);
        return;
      }
      fetchEntradas();
    };

    const handleUpdate = async (e: React.FormEvent) => {
      e.preventDefault();
      const { data, error } = await supabase.from('entradas').update([form]).eq('id', form.id);
      if (error) {
        console.error('Erro ao atualizar entrada:', error.message);
        return;
      }
      setForm({ id: '', nome: '', preco: 0, data_venc: new Date(), data_pag: new Date(), user_ref: '', image_url: '' });
      setImageFile(null);
      setImagePreview(null);
      fetchEntradas();
    };

    const handleShowDetails = () => {
      
    };

    return ( 
        <div className="w-screen bg-white h-screen flex flex-col md:flex-row">
            <div className="w-[100vw] h-[50vh] md:h-[100vh] bg-red-500">

            </div>
            <div className="w-[100vw] h-[50vh] md:h-[100vh] bg-blue-500">
                <ul className="space-y-4 bg-blue-300">
                        {entradas.map((entradas) => (
                          <li
                            key={entradas.id}
                            className="flex flex-col sm:flex-row items-center bg-white shadow-md rounded p-4"
                          >
                            {entradas.image_url && (
                              <Image
                                src={entradas.image_url}
                                alt={entradas.nome}
                                width={100}
                                height={100}
                                className="w-20 h-20 object-cover rounded"
                              />
                            )}
                            <div className="flex-1 mt-4 sm:mt-0 sm:ml-4 text-center sm:text-left">
                              <strong className="block text-lg">{entradas.nome}</strong>
                              <span className="block text-gray-500">${entradas.preco.toFixed(2)}</span>
                              <span className="block text-gray-500">{entradas.quantidade} unidades</span>
                            </div>
                            <div className="flex space-x-2 mt-4 sm:mt-0">
                              <button
                                onClick={() => handleEdit(entradas)}
                                className="bg-yellow-500 text-white px-4 py-2 rounded"
                              >
                                Editar
                              </button>
                              <button
                                onClick={() => handleDelete(entradas.id)}
                                className="bg-red-500 text-white px-4 py-2 rounded"
                              >
                                Excluir
                              </button>
                              <button
                                onClick={() => handleShowDetails(entradas)}
                                className="bg-blue-500 text-white px-4 py-2 rounded"
                              >
                                Detalhes
                              </button>
                            </div>
                          </li>
                        ))}
                      </ul>
            </div>
        </div>
     );
}
 
export default Finan;