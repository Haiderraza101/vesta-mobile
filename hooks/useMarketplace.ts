import { useState, useEffect } from 'react';
import { serviceService, Category, Service } from '../services/serviceService';

export function useMarketplace() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let catsLoaded = false;
    let servicesLoaded = false;

    const checkLoading = () => {
      if (catsLoaded && servicesLoaded) setLoading(false);
    };

    const unsubCats = serviceService.subscribeToCategories((data) => {
      setCategories(data);
      catsLoaded = true;
      checkLoading();
    });

    const unsubServices = serviceService.subscribeToServices((data) => {
      setServices(data);
      servicesLoaded = true;
      checkLoading();
    });

    return () => {
      unsubCats();
      unsubServices();
    };
  }, []);

  return { categories, services, loading };
}
