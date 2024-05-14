---
title: "INSDC"
weight: 1
draft: false
# bookFlatSection: false
# bookToc: true
# bookHidden: false
# bookCollapseSection: false
# bookComments: false
# bookSearchExclude: false
---

# The International Nucleotide Sequence Database Collaboration
The global availability of our current knowledge about DNA sequences and gene
expression is made possible by the existence of large repositories like
GeneBank, SRA, DRA, ENA, DDBJ, GEO, ArrayExpress, managed and maintained by
international organizations and consortia such as EMBL-EBI, NCBI, NIG...
Disentangling oneself amidst this bedlam of acronyms and figuring out which
database is the most suited from time to time may seem like a mess, but in fact
(and to some extent incredibly), all these acronyms can actually be seen as
multiple faces, or appendages, of the same major initiative which provides a
single global, free-of-charge access point to genomic information, namely the
__International Nucleotide Sequence Database Collaboration (INSDC)__.

This post attempts to describe the structure of such organization and the
relationships among the different points of entry to genomic information.

## INSDC DBs
Quoting the incipit of the 2021 INSDC report (Nucleic Acids Res. 2021 Jan
8;49(D1):D121-D124. PMID: [33166387](https://pubmed.ncbi.nlm.nih.gov/33166387/)
DOI: [10.1093/nar/gkaa967](https://academic.oup.com/nar/article/49/D1/D121/5964076?login=false)):
> The International Nucleotide Sequence Database Collaboration (INSDC;
> http://www.insdc.org/) is the core infrastructure for sharing nucleotide
> sequence data (NSD) and their subsidiary information called metadata in the
> public domain. The collaboration is comprised of __three nodes that keep the__
> __identical information through a daily data exchange process__ that has
> operated for over 30 years:
> - the DNA Data Bank of Japan (DDBJ; http://www.ddbj.nig.ac.jp/) at the
>	National Institute of Genetics (NIG) in Mishima, Japan;
> - the European Nucleotide Archive (ENA; http://www.ebi.ac.uk/ena/) at the
> 	European Molecular Biology Laboratory’s European Bioinformatics Institute
> 	(EMBL-EBI) in Hinxton, UK; and
> - GenBank (https://www.ncbi.nlm.nih.gov/genbank/) at National Center for
>	Biotechnology Information (NCBI), National Library of Medicine, National
> 	Institutes of Health (NIH) in Bethesda, Maryland, USA.
>
> [...]
> The key links across these databases are Accession Numbers, i.e., the unique
> and permanent identifiers issued by the INSDC for each submitted sequence.
> [...]
> The INSDC functions as the unique registry of all publicly available NSD.

Thus, INSDC archives nucleotide sequence data, from raw to assembled and
annotated sequences, from around the world by supporting deposition and
distribution of data from publicly funded science. Each of the three partner
organizations can accept new submissions to the database. Depending on which one
you choose to submit your sequencing data you will receive an accession number
with a characteristic prefix (typically, 'E' for ENA, 'D' for DDBJ, or 'S' for
NCBI), but regardless of this the same information will be transmitted within
24h to the other two nodes in the consortium to be stored in their local
databases. In any case, INSDC does not claim the ownership of data, which is
retained by the submitter.

Importantly, EMBL-EBI and NCBI also run repositories---named ArrayExpress and
Gene Expression Omnibus (GEO), respectively---meant to host _pre-NGS_ gene
expression data, mainly coming from microarray experiments. Although neither
NCBI’s GEO and EMBL-EBI’s ArrayExpress directly host raw nucleotide sequence
data, it is possible to submit your NGS data to them and they will be
automatically _brokered_ to the respective Sequence Read Archive---namely NCBI’s
SRA or EMBL-EBI’s ENA---to be made available __with the same accession__ from
all three INSDC DBs.

{{< hint warning >}}
__Alias Accession__  
While ArrayExpress does not host any RNA-Seq data after brokering to ENA, NGS
data submitted to GEO, and then brokered to SRA, will be also indexed by GEO
using a so-called _GEO-alias_ accession ID that can be equivalently used to
query INSDC DBs. In any case, NGS read brokering is ___one-way___ only, so if
you submit first to SRA or ENA, you won't get any alias ID for your study and it
won't be seen by GEO or ArrayExpress search engines.
{{< /hint >}}

<div style="text-align: center;">
<br>
{{< figure src="/images/genomic_DBs.png" title="INSDC's DBs" width=720 >}}
<br>
</div>

{{< hint info >}}
__GEO-ArrayExpress Intersection__  
As pointed out [here](https://www.ccdatalab.org/blog/gene-expression-repositories-explained)
by Kurt Wheeler, member of
[The Childhood Cancer Data Lab](https://www.ccdatalab.org/), within the context
of the [refine.bio](https://www.refine.bio/) project
> (NCBI’s GEO and EMBL-EBI’s ArrayExpress) also have a somewhat convoluted
> relationship. ArrayExpress used to replicate data from GEO on a weekly basis,
> so it contains a lot of data from there. This was true when we first started
> the _refine.bio_ project, so our original idea was to only download microarray
> data from ArrayExpress. However since then they have stopped replicating data,
> so we now download data from the source (ArrayExpress / GEO) that it was
> originally uploaded to, which we determine by its identifier.
{{< /hint >}}

## The SRA Data Model
Six types of _metadata objects_ (or _records_) exist related to the Sequence
Read Archive of INSDC. Their accessions can be used to identify each unique part
of a given submission. For all of them, the first letter of their accession
identifies which INSDC partner accepted the original submission: `E` for ENA,
`D` for DDBJ, or `S` for NCBI (`N` in the corresponding _BioSamples_ /
_BioProject_ objects).
- __Runs__ - Metadata objects that directly represent the raw read files
	generated by sequencing (typically a FASTQ file). Accessions for Runs follow
	the regex pattern `(E|D|S)RR[0-9]{6,}` (e.g., SRR3085451).
- __Experiments__ - Metadata about how the sequencing was performed (sequencing
	methods such as library and instrument details). Accessions for Experiments
	follow the regex `(E|D|S)RX[0-9]{6,}` (e.g., SRX1517159).
- __Samples__ - Descriptions of biologically or physically unique specimens
	(i.e., the sequenced source material). Accessions for Samples follow the
	regex pattern `(E|D|S)RS[0-9]{6,}` (e.g., SRS1235761). However, these IDs
	are used (by ENA) as _Secondary Sample Accessions_, since each _Sample_
	directly corresponds to a _BioSample_ whose ID `SAM(E|D|N)[A-Z]?[0-9]+`
	(e.g., SAMN04384212) is taken as the primary one. If data were brokered by
	GEO to INSDC's SRA, a different _Experiment Alias_ accession of the type
	`GSM[0-9]+` (e.g., GSM2027569) will be also associated to each sample.
- __Projects__/__Studies__ - Contain information on a biological research
	project. This holds all the data generated as part of this research (often
	coinciding with a publication). Accessions for Studies follow the regex
	pattern `(E|D|S)RP[0-9]{6,}` (e.g., SRP068092). However, these IDs are used
	(by ENA) as _Secondary Study Accessions_, since each _Study_ directly
	corresponds to a _BioProject_ whose ID `PRJ(E|D|N)[A-Z][0-9]+` (e.g.,
	PRJNA307652) is taken as the primary one. __This is the accession typically
	used in journal publications__. If data were brokered by GEO to INSDC's SRA,
	a _Study Alias_ accession of the type `GSE[0-9]+` (e.g., GSE76528) will be
	also associated to the entire project.
- __Submission__ - Metadata about the submission of the data to SRA. Accessions
	for Submissions follow the regex pattern `(E|D|S)RA[0-9]{6,}`.
- __Analyses__ - Hold results files of analyses performed on sequencing data
	(e.g., a genome assembly) and analysis methods. Accessions for Analyses
	follow the regex pattern `(E|D|S)RZ[0-9]{6,}`.



## References
ENA: Guidelines and Tutorials
https://ena-docs.readthedocs.io/en/latest/index.html

Archive-Generated Files
Providing archive-generated FASTQs for runs is a means of bringing some consistency to the data we provide. By imposing a level of uniformity on these files, we can ensure users know what to expect of them and may incorporate them into pipelines with minimal friction.


https://www.ccdatalab.org/blog/gene-expression-repositories-explained

https://ena-docs.readthedocs.io/en/latest/submit/general-guide/accessions.html

https://ena-docs.readthedocs.io/en/latest/retrieval/ena-project.html
