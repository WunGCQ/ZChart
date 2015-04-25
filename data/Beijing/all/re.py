#coding: utf-8
import os
import csv

def  removeAll(path) :
	for root, dirs, files in os.walk( path ):
		for fn in files:
			removeColCSV(fn)

def removeColCSV(csvfile) :
	if csvfile.find('_all') !=  -1 :
		print(csvfile)
		newCSVName = csvfile.split('_')[2] 
		c = open(newCSVName,'wb')
		cToRead = open(csvfile,'rb')
		reader = csv.reader(cToRead)
		writer = csv.writer(c)
		writer.writerow(['date','hour','type','dongsi'])
		counter = 0
		writeData = []
		for line in reader :
			print(line)
			counter = counter + 1
			if (counter % 5 == 1 or counter%5 == 2) and (counter!=1) :
				writeData.append((line[0],line[1],line[2],line[3]))
		
		cToRead.close()
		writer.writerows(writeData)
		c.close()

removeAll('../all')