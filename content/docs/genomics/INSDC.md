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

Quoting the incipit of
[PMID: 33166387](https://pubmed.ncbi.nlm.nih.gov/33166387/):

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

<div style="text-align: center;">
<br>
{{< figure src="/images/genomic_DBs.png" title="INSDC's DBs" width=720 >}}
<br>
</div>

{{< hint warning >}}
__Alias Accession__  
While ArrayExpress does not host any RNA-Seq data after brokering to ENA, NGS
data submitted to GEO, and then brokered to SRA, will be also indexed by GEO
using a so-called _GEO-alias_ accession ID that can be equivalently used to
query INSDC DBs. In any case, NGS read brokering is ___one-way___ only, so if
you submit first to SRA or ENA, you won't get any alias ID for your study and it
won't be seen by GEO or ArrayExpress search engines.
{{< /hint >}}
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


Six types of SRA metadata objects exist

Run - A metadata object that directly represents the file generated by sequencing. Accessions for Runs have the prefix SRR/ERR/DRR.

Experiment - Metadata about how the sequencing was performed. Accessions for Experiments have the prefix SRX/ERX/DRX.

Sample - A description of biologically or physically unique specimens. Directly corresponds to a BioSample. Accessions for Samples have the prefix SRS/ERS/DRS.

Study - A description of the research effort that required the sequencing. Directly corresponds to a BioProject. Accessions for Studies have the prefix SRP/ERP/DRP.

Submission - Metadata about the submission of the data to SRA. Accessions for Submissions have the prefix SRA/ERA/DRA.

Analysis - A representation of an analysis that was submitted to SRA about the data. refine.bio does not survey or store metadata objects of this type.





https://www.ccdatalab.org/blog/gene-expression-repositories-explained

https://ena-docs.readthedocs.io/en/latest/submit/general-guide/accessions.html

https://ena-docs.readthedocs.io/en/latest/retrieval/ena-project.html
