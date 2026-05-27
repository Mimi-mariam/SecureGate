import { db } from '@/lib/db';

async function main() {
  const email = 'marizmimi111@gmail.com';
  try {
    const deleted = await db.user.delete({
      where: { email },
    });
    console.log('✅ User deleted:', deleted);
  } catch (error) {
    console.error('❌ Failed to delete user:', error);
  }
}

main();
