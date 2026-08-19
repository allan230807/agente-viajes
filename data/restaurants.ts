export const restaurants = [
  // 🍳 DESAYUNOS, CAFÉS Y TRADICIÓN
  {
    id: "rest-hermanos-moya",
    nombre: "Arepas Hermanos Moya",
    zona: "Centro-Norte",
    municipio: "Antolín del Campo (El Salado)",
    estrellas: 4.9,
    horario: "07:00 - 12:00",
    comidas: ["Desayuno"],
    costo_promedio_usd: 10,
    perfil: "Parada obligatoria. Famosos por sus arepas de pastel de chucho con queso pecorino.",
    coordenadas: { lat: 11.0583, lng: -63.8561 }
  },
  {
    id: "rest-mercado-conejero",
    nombre: "Empanadas de Conejero",
    zona: "Centro",
    municipio: "García",
    estrellas: 4.7,
    horario: "06:00 - 13:00",
    comidas: ["Desayuno"],
    costo_promedio_usd: 5,
    perfil: "Experiencia local auténtica. Decenas de puestos compitiendo con las mejores empanadas de cazón de la isla.",
    coordenadas: { lat: 10.9592, lng: -63.8680 }
  },
  {
    id: "rest-cafe-de-la-plaza",
    nombre: "Café de la Plaza",
    zona: "Centro-Este",
    municipio: "Arismendi (La Asunción)",
    estrellas: 4.6,
    horario: "08:00 - 20:00",
    comidas: ["Desayuno", "Merienda"],
    costo_promedio_usd: 8,
    perfil: "Ideal para tomar un buen café, comer churros y postres frente a la catedral en el casco histórico.",
    coordenadas: { lat: 11.0290, lng: -63.8630 }
  },

  // 🥘 ALMUERZOS CRIOLLOS Y DEL MAR
  {
    id: "rest-casa-ruben",
    nombre: "La Casa de Rubén",
    zona: "Sur-Este",
    municipio: "Mariño (Porlamar)",
    estrellas: 4.8,
    horario: "11:30 - 16:30",
    comidas: ["Almuerzo"],
    costo_promedio_usd: 20,
    perfil: "Icono gastronómico. Su plato estrella es el auténtico Pastel de Chucho y la ensalada de catalana.",
    coordenadas: { lat: 10.9631, lng: -63.8315 }
  },
  {
    id: "rest-dolphin",
    nombre: "Dolphin",
    zona: "Este",
    municipio: "Maneiro (Pampatar)",
    estrellas: 4.5,
    horario: "11:00 - 18:00",
    comidas: ["Almuerzo"],
    costo_promedio_usd: 18,
    perfil: "Comida a la orilla de la bahía de Pampatar. Perfecto para comer pescado frito fresco viendo los botes.",
    coordenadas: { lat: 10.9960, lng: -63.7950 }
  },
  {
    id: "rest-el-fondeadero",
    nombre: "El Fondeadero",
    zona: "Este",
    municipio: "Maneiro (Pampatar)",
    estrellas: 4.4,
    horario: "11:30 - 19:00",
    comidas: ["Almuerzo"],
    costo_promedio_usd: 22,
    perfil: "Amplio restaurante frente al mar, ideal para grupos grandes. Especialistas en paellas y mariscos.",
    coordenadas: { lat: 10.9950, lng: -63.7960 }
  },
  {
    id: "rest-pola",
    nombre: "Restaurante Pola",
    zona: "Norte",
    municipio: "Antolín del Campo (Playa El Agua)",
    estrellas: 4.3,
    horario: "10:00 - 17:00",
    comidas: ["Almuerzo"],
    costo_promedio_usd: 20,
    perfil: "Clásico de Playa El Agua. Comida de mar directo en la arena con excelente atención.",
    coordenadas: { lat: 11.1460, lng: -63.8640 }
  },

  // 🥩 CARNES Y PARRILLAS
  {
    id: "rest-rancho-de-pablo",
    nombre: "El Rancho de Pablo",
    zona: "Sur-Este",
    municipio: "Mariño (Porlamar)",
    estrellas: 4.7,
    horario: "12:00 - 22:00",
    comidas: ["Almuerzo", "Cena"],
    costo_promedio_usd: 25,
    perfil: "El mejor lugar de la isla para comer cortes de carne de primera y parrillas en ambiente familiar.",
    coordenadas: { lat: 10.9600, lng: -63.8350 }
  },
  {
    id: "rest-el-faraon",
    nombre: "Asador El Faraón",
    zona: "Sur-Este",
    municipio: "Mariño (Porlamar)",
    estrellas: 4.5,
    horario: "12:00 - 23:00",
    comidas: ["Almuerzo", "Cena"],
    costo_promedio_usd: 30,
    perfil: "Excelente asador con cortes importados y nacionales, barra de ensaladas y buen ambiente.",
    coordenadas: { lat: 10.9655, lng: -63.8250 }
  },

  // 🍽️ VERSÁTILES Y COCINA DE AUTOR
  {
    id: "rest-casa-de-esther",
    nombre: "La Casa de Esther",
    zona: "Norte",
    municipio: "Gómez (Pedro González)",
    estrellas: 4.9,
    horario: "12:00 - 17:00",
    comidas: ["Almuerzo"],
    costo_promedio_usd: 25,
    perfil: "Cocina de autor margariteña. Sabores locales elevados con técnicas gourmet en un ambiente íntimo.",
    coordenadas: { lat: 11.1040, lng: -63.9850 }
  },
  {
    id: "rest-guillermina",
    nombre: "Guillermina Restaurant",
    zona: "Centro-Este",
    municipio: "Arismendi (La Asunción)",
    estrellas: 4.7,
    horario: "08:00 - 22:00",
    comidas: ["Desayuno", "Almuerzo", "Cena"],
    costo_promedio_usd: 25,
    perfil: "Cocina de autor que fusiona lo tradicional con lo moderno en una casa colonial hermosa.",
    coordenadas: { lat: 11.0285, lng: -63.8624 }
  },
  {
    id: "rest-el-remo",
    nombre: "El Remo",
    zona: "Sur-Este",
    municipio: "Mariño (Porlamar)",
    estrellas: 4.6,
    horario: "11:30 - 22:00",
    comidas: ["Almuerzo", "Cena"],
    costo_promedio_usd: 25,
    perfil: "Clásico tradicional. Atención de primera, ambiente familiar y especialidad en cocina mediterránea y del mar.",
    coordenadas: { lat: 10.9540, lng: -63.8450 }
  },

  // 🍕 ITALIANA Y PIZZAS
  {
    id: "rest-portarossa",
    nombre: "Portarossa",
    zona: "Este",
    municipio: "Maneiro (Pampatar)",
    estrellas: 4.8,
    horario: "12:00 - 23:00",
    comidas: ["Almuerzo", "Cena"],
    costo_promedio_usd: 25,
    perfil: "Verdadera pizza napolitana en un ambiente rústico-chic muy popular con horno de leña.",
    coordenadas: { lat: 10.9945, lng: -63.8000 }
  },
  {
    id: "rest-gaia",
    nombre: "Gaia Trattoria",
    zona: "Este",
    municipio: "Maneiro (Pampatar)",
    estrellas: 4.8,
    horario: "18:00 - 23:00",
    comidas: ["Cena"],
    costo_promedio_usd: 35,
    perfil: "Auténtica comida italiana y pastas artesanales. Local pequeño, exclusivo y atención personalizada.",
    coordenadas: { lat: 10.9965, lng: -63.7990 }
  },
  // 🥘 DOWNTOWN PORLAMAR Y MERCADOS
  {
    id: "rest-mercado-conejero",
    nombre: "Empanadas del Mercado de Conejero",
    zona: "Centro-Sur",
    municipio: "García",
    estrellas: 4.9,
    horario: "06:00 - 13:00",
    costo_usd: 3,
    comidas: ["Desayuno", "Empanadas", "Cazón"],
    perfil: "El templo del desayuno margariteño. Famoso por sus empanadas de cazón, mariscos y jugos naturales. Imprescindible.",
    coordenadas: { lat: 10.9592, lng: -63.8569 }
  },
  {
    id: "rest-la-especial-porlamar",
    nombre: "La Especial (Centro)",
    zona: "Centro (Porlamar)",
    municipio: "Mariño",
    estrellas: 4.5,
    horario: "07:00 - 19:00",
    costo_usd: 8,
    comidas: ["Desayuno", "Almuerzo", "Cafetería"],
    perfil: "Un clásico del centro de Porlamar. Ideal para comer bien, rápido y tradicional en medio del ajetreo comercial.",
    coordenadas: { lat: 10.9531, lng: -63.8375 }
  },
  {
    id: "rest-el-rincon-del-pescador",
    nombre: "El Rincón del Pescador",
    zona: "Centro (Porlamar)",
    municipio: "Mariño",
    estrellas: 4.6,
    horario: "11:00 - 17:00",
    costo_usd: 15,
    comidas: ["Mariscos", "Pescado Frito", "Almuerzo"],
    perfil: "Ubicado cerca de los muelles pesqueros del centro. Pescado fresco del día garantizado, ambiente auténtico y sin pretensiones.",
    coordenadas: { lat: 10.9490, lng: -63.8355 }
  },
  {
    id: "rest-panaderia-las-caracolas",
    nombre: "Panadería y Pastelería Las Caracolas",
    zona: "Centro (Porlamar)",
    municipio: "Mariño",
    estrellas: 4.4,
    horario: "06:30 - 20:00",
    costo_usd: 5,
    comidas: ["Desayuno", "Merienda", "Panadería"],
    perfil: "Punto de encuentro céntrico para tomar café y probar dulces locales mientras caminas por el boulevard.",
    coordenadas: { lat: 10.9525, lng: -63.8368 }
  },
  {
    id: "rest-il-nonno",
    nombre: "Pizzería Il Nonno",
    zona: "Este",
    municipio: "Maneiro",
    estrellas: 4.6,
    horario: "12:00 - 22:30",
    comidas: ["Almuerzo", "Cena"],
    costo_promedio_usd: 15,
    perfil: "Pizzas de masa fina y crujiente, ambiente relajado, excelente relación calidad-precio.",
    coordenadas: { lat: 10.9880, lng: -63.8100 }
  },

  // 🍷 CENAS, TAPAS Y ALTA COCINA
  {
    id: "rest-juana-la-loca",
    nombre: "Juana La Loca",
    zona: "Este",
    municipio: "Maneiro (Pampatar)",
    estrellas: 4.9,
    horario: "18:00 - 23:30",
    comidas: ["Cena"],
    costo_promedio_usd: 45,
    perfil: "Alta cocina, ambiente exclusivo dentro de un hotel boutique. Ideal para cenas románticas.",
    coordenadas: { lat: 10.9930, lng: -63.7985 }
  },
  {
    id: "rest-amaranto",
    nombre: "Amaranto",
    zona: "Este",
    municipio: "Maneiro (Pampatar)",
    estrellas: 4.7,
    horario: "17:00 - 23:30",
    comidas: ["Cena"],
    costo_promedio_usd: 35,
    perfil: "Cocina fusión y coctelería de autor en una casa antigua restaurada. Ambiente íntimo y buena música.",
    coordenadas: { lat: 10.9952, lng: -63.7978 }
  },
  {
    id: "rest-095",
    nombre: "095 Restobar",
    zona: "Este",
    municipio: "Maneiro (Pampatar)",
    estrellas: 4.6,
    horario: "18:00 - 02:00",
    comidas: ["Cena", "Tragos"],
    costo_promedio_usd: 25,
    perfil: "Lugar de moda para cenar tapas, sushi y tomar buenos cócteles antes de salir de fiesta.",
    coordenadas: { lat: 10.9970, lng: -63.7940 }
  }
];