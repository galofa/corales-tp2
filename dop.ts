import { PrismaClient } from './generated/prisma'

const prisma = new PrismaClient()

async function main() {
  const user = await prisma.user.create({
    data: {

      name: 'periquito',
  
      email: 'peroquito@prisma.io',
      passwordHash: 'adjaslkdjio23u912389sjdau8zxc9789zxv789123789mnl'
    
    },
  })
  console.log(user)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })