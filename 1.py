import csv

input_file = '/Users/liburang/Desktop/Freedom-of-speech-/freedom_with_continent.csv'
output_file = '/Users/liburang/Desktop/Freedom-of-speech-/freedom_with_continent_filtered.csv'

with open(input_file, 'r') as infile, open(output_file, 'w', newline='') as outfile:
    reader = csv.reader(infile)
    writer = csv.writer(outfile)
    
    for row in reader:
        # 假设年份在第二列（索引为1），并且是数字
        if row[1].isdigit() and int(row[1]) >= 1900:
            writer.writerow(row)

print(f"过滤完成，结果已保存到 {output_file}")