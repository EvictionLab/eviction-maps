export const DataAttributes = [
    {
        'id': 'poverty-rate',
        'name': 'Poverty Rate',
        'stops' : {
            'default': [
                [0, 'blue'],
                [1, 'red']
            ],
            'blockgroups': [
                [0, 'green'],
                [1, 'yellow']
            ]
        }
    },
    {
        'id': 'population',
        'name': 'Population',
        'stops' : {
            'default': [
                [0, 'blue'],
                [10000, 'red']
            ],
            'blockgroups': [
                [0, 'green'],
                [1000, 'yellow']
            ]
        }
    }
];
