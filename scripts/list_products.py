import sqlite3

db='smailstore.db'
conn=sqlite3.connect(db)
c=conn.cursor()
print('id,name,slug,category,is_active,is_upsell')
for row in c.execute('SELECT id,name,slug,category,is_active,is_upsell FROM products'):
    print(','.join([str(row[0]), row[1].replace(',', ' '), row[2], str(row[3]), str(row[4]), str(row[5])]))
conn.close()
