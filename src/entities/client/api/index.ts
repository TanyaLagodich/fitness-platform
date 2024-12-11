import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { getFirestore } from 'firebase/firestore';
import { app } from '@/app/config/firebase';
import { Client } from '@/shared/types';

const db = getFirestore(app);
const clientCollection = collection(db, 'clients');

// Получение списка клиентов
export const fetchClients = async (): Promise<Client[]> => {
    const snapshot = await getDocs(clientCollection);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Client));
};

export const createClient = async (client: Omit<Client, 'id'>): Promise<Client> => {
    try {
        console.log('Adding client:', client);
        const docRef = await addDoc(clientCollection, client);
        console.log('Document added with ID:', docRef.id);
        return { id: docRef.id, ...client };
    } catch (error) {
        console.error('Error adding document:', error);
        throw error; // Проброс ошибки для отладки
    }
};


// Обновление клиента
export const updateClient = async (id: string, client: Partial<Client>): Promise<void> => {
    const docRef = doc(db, 'clients', id);
    await updateDoc(docRef, client);
};

// Удаление клиента
export const deleteClient = async (id: string): Promise<void> => {
    const docRef = doc(db, 'clients', id);
    await deleteDoc(docRef);
};
