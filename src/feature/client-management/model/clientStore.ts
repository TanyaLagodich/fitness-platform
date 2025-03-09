import { ref, onMounted } from 'vue';
import { Client } from '../../../shared/types';
import { useClientsApi } from '@/shared/api';

export function useClientStore() {
  const search = ref<string>('');
  const isLoading = ref<boolean>(false);
  const clients = ref<Client[]>([]);

  const clientsApi = useClientsApi();

  const fetchClients = async () => {
    isLoading.value = true;
    clients.value = await clientsApi.getClients(search.value);
    isLoading.value = false;
  };

  const filteredClients = ref<Client[]>([]);

  const filterClients = () => {
    filteredClients.value = clients.value.filter(({ name }) =>
      name.toLowerCase().includes(search.value.toLowerCase())
    );
  };

  const addNewClient = async (client: Client) => {
    await clientsApi.addClient(client);
    await fetchClients();
  };

  const getClient = async (id: number) => {
    await clientsApi.getClientById(id);
  };

  onMounted(fetchClients);

  return {
    search,
    isLoading,
    clients,
    filteredClients,
    fetchClients,
    addNewClient,
    filterClients,
    getClient,
  };
}
