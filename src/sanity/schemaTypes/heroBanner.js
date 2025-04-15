export default {
    name: 'heroBanner',
    title: 'Hero Banner',
    type: 'document',
    fields: [
      {
        name: 'image',
        title: 'Image',
        type: 'image',
        options: {
          hotspot: true,
        },
      },
      {
        name: 'buttonText',
        title: 'Button Text',
        type: 'string',
      },
      {
        name: 'product',
        title: 'Product',
        type: 'string',
        description: 'Product slug to link to',
      },
      {
        name: 'desc',
        title: 'Description',
        type: 'string',
      },
      {
        name: 'smallText',
        title: 'Small Text',
        type: 'string',
      },
      {
        name: 'midText',
        title: 'Middle Text',
        type: 'string',
      },
      {
        name: 'largeText1',
        title: 'Large Text',
        type: 'string',
      },
    ],
  };