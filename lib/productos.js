import { supabase } from './supabase';

export async function getProductos() {
  const { data, error } = await supabase
    .from('productos')
    .select('*')
    .order('id', { ascending: true });

  if (error) {
    console.error('Error al traer productos:', error);
    return [];
  }

  return data || [];
}

export async function getProductoPorId(id) {
  const productos = await getProductos();

  const producto = productos.find((producto) => {
    return Number(producto.id) === Number(id);
  });

  return producto || null;
}