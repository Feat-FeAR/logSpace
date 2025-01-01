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
Be careful in applying what happens during Illumina paired-end RNA sequencing---where we end up with R1/R2 (forward/reverse) reads---to the use of forward/reverse when talking about transcripts, genomes, etc., since they are two almost unrelated concepts.
In paired-end sequencing the original molecule is denatured (i.e., strands get separated) before applying to the flow cell, then one strand is sequenced from the 5' end while the other strand is similarly sequenced from its 5' end.
So the paired end sequencing is actually from different strands but, unless you use some _stranded library_ prep kit during cDNA synthesis, information about the source strand is lost (the original RNA molecule could be from either the forward or reverse strand of the genome/transcriptome).
On the contrary, stranded libraries preserve strand information, making it possible to resolve overlapping genes or antisense transcription.
In this case, people could talk about using the "forward read strand from the reverse biological strand", etc.
{{< /hint >}}


## RNA maturation process
RNA _maturation_, also known as RNA _processing_, is a series of modifications that _precursor mRNA_ (aka _pre-mRNA_ or _primary transcript_) undergoes to become a _mature mRNA_ molecule ready for translation in the course of protein synthesis.

In eukaryotic cells, post-transcription modifications for the production of a mature mRNA molecule occurs inside the nucleus and involve the following 3 main steps.

1. __Capping of the 5' end:__ a 7-methylguanosine cap is added to the 5' end of the pre-mRNA.
5'- and 3'-terminal end modifications increase mRNA stability (protect from enzymatic degradation), facilitate export from the nucleus, and aid in ribosome recognition during translation.

1. __Polyadenylation of the 3' end:__ a poly(A) tail (a string of adenine nucleotides) is added to the 3' end of the pre-mRNA by the poly(A) polymerase enzyme.
The length of the poly(A) tail varies, but is typically 50-250 nucleotides in most eukaryotes.
Enzymes like deadenylases can gradually shorten the tail, leading to mRNA degradation, hence Longer poly(A) tails generally increase mRNA lifespan.
This process regulates mRNA turnover and gene expression.

1. __RNA Splicing of the introns:__ introns (non-coding regions) are removed, and exons (coding regions) are joined together.
RNA spicing is carried out by the _spliceosome_, a large ribonucleoprotein (a complex of small nuclear RNAs, snRNAs, and proteins) which cleaves the RNA at the splicing site and recombines the exons of the RNA.
In this step, _alternative splicing_ can occur, allowing one gene to produce multiple protein variants.

The mature mRNA is finally transported via the nuclear pore complex out of the nucleus into the cytoplasm, where will be used in translation.

<br>
<div style="text-align: center;">
{{< figure src="/images/RNA_maturation.png" title="mRNA maturation process" width=720 >}}
<figcaption style="font-size: 13px;">
Figure by Thomas Shafee - Shafee T, Lowe R (2017). "Eukaryotic and prokaryotic gene structure". WikiJournal of Medicine 4 (1). DOI:10.15347/wjm/2017.002. ISSN 20024436., CC BY 4.0, https://commons.wikimedia.org/w/index.php?curid=39495317
</figcaption>
</div>
<br>

{{< hint info >}}
__NOTE__  

In __prokaryotes__, transcription and translation occur simultaneously in the cytoplasm, so RNA maturation is minimal or non-existent.
For instance, prokaryotic cells generally do not append poly(A) tails to their mRNAs, which are inherently less stable and processed differently.
Furthermore, when polyadenylation occurs in bacteria, it usually promotes RNA degradation, rather than stability.

On the contrary, in __eukaryotes__ the poly(A) tail is a defining feature of most mRNAs, with the sole exception of histone mRNAs, the only mRNAs that lack a poly(A) tail.
Notably, many __long non-coding RNAs__ (lncRNAs) also undergo splicing and have a poly(A) tail in their mature form, which, however---as in the case of bacteria---may promote transcript degradation rather than stability.
{{< /hint >}}
