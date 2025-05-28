import db from "./src/db"

async function main() {
  const user = await db.user.create({
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
    await db.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await db.$disconnect()
    process.exit(1)
  })