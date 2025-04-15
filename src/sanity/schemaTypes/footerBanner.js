export default {
    name: 'footerBanner',
    title: 'Footer Banner',
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
        title: 'Large Text 1',
        type: 'string',
      },
      {
        name: 'largeText2',
        title: 'Large Text 2',
        type: 'string',
      },
      {
        name: 'discount',
        title: 'Discount',
        type: 'string',
      },
      {
        name: 'saleTime',
        title: 'Sale Time',
        type: 'string',
      },
    ],
  };