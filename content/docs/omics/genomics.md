---
title: "Genomics"
weight: 10
draft: false
# bookFlatSection: false
# bookToc: true
# bookHidden: false
# bookCollapseSection: false
# bookComments: false
# bookSearchExclude: false
---

# Gen..ics Basics
What follows is a nonorganic collection of fundamental genetics and genomics concepts that even a physicist would do well not to ignore when going into bioinformatics.

## DNA strands
Quoting (with minor reworking) the clear and concise [Biostars post by Bio_X2Y](https://www.biostars.org/p/3423/): 
- DNA is double-stranded.
By convention, for a reference chromosome, one whole strand is designated the "forward strand" and the other the "reverse strand".
Sometimes the terms "plus strand" and "minus strand" are used instead.
__This designation is arbitrary.__
In fact, for humans there is a policy whereby the forward strand is always the one with the 5' end closest to centromere (i.e., the one which contains the centromere at the lowest numerical index).
However, this convention does not apply generally outside of humans. 

- Visually (I'm not talking about the RNA polymerase transcription machinery yet!), you would typically read the sequence of a strand in the 5-3 direction.
For the forward strand, this means reading left-to-right, and for the reverse strand it means right-to-left.

- __A gene can live on a DNA strand in one of two orientations.__
The gene is said to have a _coding strand_ (also known as its _sense strand_), and a _template strand_ (also known as its _antisense strand_).
For about half of genes, their coding strand will correspond to the chromosome's forward strand, and for the other half it will correspond to the reverse strand.

- The mRNA (and protein) sequence of a gene corresponds to the DNA sequence as read (again, visually) from the gene's coding strand.
So the mRNA sequence always corresponds to the 5-3 coding sequence of a gene.

- Now, the RNA polymerase machinery moves along the DNA in the 5-3 orientation of the coding strand (e.g., left-to-right for a forward strand gene).
It reads the bases from the template strand (so it is reading in the 3-5 direction from the point-of-view of the template strand), and builds the mRNA as it goes.
This means that the mRNA matches the coding sequence of the gene, not the template sequence (see diagram below).
<br>
<br>
<div style="text-align: center;">
	{{< figure src="/images/RNAP.svg" title="Transcription elongation" width=680 >}}
</div>

- Annotations such as Ensembl and UCSC are concerned with the coding sequences of genes, so when they say a gene is on the forward strand, it means the gene's coding sequence is on the forward strand.
To follow through again, that means that during transcription of this forward-strand gene, the gene's template sequence is read from the reverse strand, producing an mRNA that matches the sequence on the forward strand.

{{< hint warning >}}
__WARNING__  
Be careful in applying what happens during Illumina paired-end sequencing---where we end up with R1/R2 (forward/reverse) reads---to the use of forward/reverse when talking about transcripts, genomes, etc., since they are almost unrelated concepts.
In paired-end sequencing the original molecule is denatured and one strand is sequenced from the 5' end while the other strand is similarly sequenced from its 5' end.
So the paired end sequencing is actually from different strands but, unless you use some _stranded_ library prep kit, the original molecule could come from either the forward or reverse strand of the genome/transcriptome/etc. (i.e., information about the source strand is lost).
On the contrary, stranded libraries preserve strand information, making it possible to resolve overlapping genes or antisense transcription.
In this case, people could talk about using the "forward read strand from the reverse biological strand", etc.
{{< /hint >}}
