const fs = require('fs');
let content = fs.readFileSync('src/components/AdminModules.tsx', 'utf8');

content = content.replace(
  'const { virtualCards, updateVirtualCardStatus, users, adminSettings } = useBank();',
  'const { virtualCards, updateVirtualCardStatus, users, adminSettings, createVirtualCard } = useBank();'
);

content = content.replace(
  '<div className="p-8 text-center text-foreground/50">No cards found</div>',
  `<div className="p-8 text-center flex flex-col items-center justify-center">
            <p className="text-foreground/50 mb-4">No cards found</p>
            {virtualCards.length === 0 && (
              <button 
                onClick={() => {
                  const demoUser = users.find(u => u.role !== 'admin');
                  if (!demoUser) return alert('No regular users found to assign cards to.');
                  createVirtualCard({
                    userId: demoUser.id,
                    cardNumber: '4532123456789012',
                    expiry: '12/28',
                    cvv: '123',
                    status: 'active',
                    type: 'virtual',
                    tier: 'standard',
                    network: 'visa',
                    price: 500
                  });
                  createVirtualCard({
                    userId: demoUser.id,
                    cardNumber: '5412987654321098',
                    expiry: '09/27',
                    cvv: '456',
                    status: 'pending',
                    type: 'virtual',
                    tier: 'black',
                    network: 'mastercard',
                    price: 5000
                  });
                }}
                className="px-6 py-2 bg-primary/20 text-primary font-bold rounded-lg hover:bg-primary/30 transition-colors"
              >
                Load Sample Cards
              </button>
            )}
          </div>`
);

fs.writeFileSync('src/components/AdminModules.tsx', content);
