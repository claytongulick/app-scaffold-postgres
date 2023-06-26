let users = [
    {
        username: 'admin@example.com',
        email_address: 'admin@example.com',
        first_name: 'admin',
        last_name: 'user',
        phone: '',
        roles: ['admin'],
        password: 'change me immediately'
    }
];

if(['local','development'].includes(process.env.NODE_ENV)) {
    users.push(
        {
            username: 'test_user@example.com',
            email_address: 'test_user@example.com',
            first_name: 'user',
            last_name: 'test',
            phone: '',
            roles: ['user'],
            password: 'change me immediately'
        },
    );
}

export default users;