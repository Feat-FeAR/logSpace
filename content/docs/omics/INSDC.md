---
title: "The INSDC"
weight: 10
draft: false
# bookFlatSection: false
# bookToc: true
# bookHidden: false
# bookCollapseSection: false
# bookComments: false
# bookSearchExclude: false
---

# The International Nucleotide Sequence Database Collaboration

<br>
<div style="text-align: center;">
	{{< figure src="/images/INSDC_logo.png" title="ENA logo" width=400 >}}
</div>
<br>

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
Quoting the _incipit_ of the 2021 INSDC report (Nucleic Acids Res. 2021 Jan
8;49(D1):D121-D124. PMID: [33166387](https://pubmed.ncbi.nlm.nih.gov/33166387/)
DOI: [10.1093/nar/gkaa967](https://academic.oup.com/nar/article/49/D1/D121/5964076?login=false)):
> _The International Nucleotide Sequence Database Collaboration (INSDC;
http://www.insdc.org/) is the core infrastructure for sharing nucleotide
sequence data (NSD) and their subsidiary information called metadata in the
public domain. The collaboration is comprised of __three nodes that keep the__
__identical information through a daily data exchange process__ that has
operated for over 30 years:_
> - _the DNA Data Bank of Japan (DDBJ; http://www.ddbj.nig.ac.jp/) at the
>	National Institute of Genetics (NIG) in Mishima, Japan;_
> - _the European Nucleotide Archive (ENA; http://www.ebi.ac.uk/ena/) at the
> 	European Molecular Biology Laboratory’s European Bioinformatics Institute
> 	(EMBL-EBI) in Hinxton, UK; and_
> - _GenBank (https://www.ncbi.nlm.nih.gov/genbank/) at National Center for
>	Biotechnology Information (NCBI), National Library of Medicine, National
> 	Institutes of Health (NIH) in Bethesda, Maryland, USA._
>
> _[...] The key links across these databases are Accession Numbers, i.e., the
unique and permanent identifiers issued by the INSDC for each submitted
sequence. [...] The INSDC functions as the unique registry of all publicly
available NSD._

Thus, INSDC archives nucleotide sequence data, from raw to assembled and
annotated sequences, from around the world by supporting deposition and
distribution of data from publicly funded science. Each of the three partner
organizations can accept new submissions to the database. Depending on which one
you choose to submit your sequencing data you will receive an accession number
with a characteristic prefix (typically, 'E' for ENA, 'D' for DDBJ, or 'S' for
NCBI), but regardless of this the same information will be transmitted within
24h to the other two nodes in the consortium to be stored in their local
databases. INSDC data are then provided openly and free of charge to users. In
any case, INSDC does not claim the ownership of data, which is retained by the
submitter.

Importantly, EMBL-EBI and NCBI also run repositories for _functional genomics_
experiments---named ArrayExpress and Gene Expression Omnibus (GEO),
respectively---designed to host _pre-NGS_ gene expression data, mainly coming
from microarray experiments. Although neither NCBI’s GEO nor EMBL-EBI’s
ArrayExpress directly host raw nucleotide sequence data, it is still possible to
submit NGS data to these repositories, but they will _broker_ the whole data
storage and management to their respective Sequence Read Archives---namely
NCBI’s SRA or EMBL-EBI’s ENA---to make them available __with the same
accession__ from all three INSDC DBs.

{{< hint warning >}}
__Alias Accession__  
NGS data submitted to GEO or ArrayExpress, and then brokered to SRA, will be
also indexed in the submission database by an ID that will be referred to by SRA
as _Study Alias_ accession ID, and which can be equivalently used to query INSDC
DBs. In any case, NGS read brokering is ___one-way___ only, so if you directly
submit to NCBI's SRA or ENA, you won't get any alias ID for your study and it
won't be seen by GEO or ArrayExpress search engines.
{{< /hint >}}

<div style="text-align: center;">
<br>
{{< figure src="/images/genomic_DBs.png" title="INSDC's DBs" width=720 >}}
<figcaption style="font-size: 13px;">
Diagram of the relationships among the major DBs involved in INSDC's management
of nucleotide sequence data (NSD) and assembled sequence data from the
traditional, annotated archives (such as NCBI's GenBank and DDBJ). Importantly,
the scope of INSDC is not limited to NSD. Other databases coordinated by
INSDC---but not represented here---collect metadata about research projects
(<em>BioProject</em> database) and physical biomaterials (<em>BioSample</em>
database), with links to NSD. In particular, BioProjects aggregate top-level
information of different types (complete genomes, transcriptomes, metagenomics
projects, targeted locus studies and many more) that relates otherwise dispersed
sequence records to coherent studies that initiate from a single organization,
consortium or funding initiative.
</figcaption>
<br>
</div>

{{< hint info >}}
__GEO-ArrayExpress Intersection__  
NCBI’s GEO and EMBL-EBI’s ArrayExpress also have a somewhat convoluted
relationship. Some of the experiments and array designs in ArrayExpress have
been imported from the GEO in the past, however this regular import has stopped
in 2017. Imported experiments have ArrayExpress accession numbers in the format
of `E-GEOD-n`, where `n` is the same as the number in the original GEO series
accession (e.g., GEO accession GSE12345 would become E-GEOD-12345 in
ArrayExpress).
{{< /hint >}}

## SRA Data Model
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
	directly corresponds to a _BioSample_ entry whose ID
	`SAM(E|D|N)[A-Z]?[0-9]+` (e.g., SAMN04384212) is taken as the primary one.
	If data were brokered by GEO (or ArrayExpress) to INSDC's SRA, an additional
	_Sample Alias_ accession ID of the type `GSM[0-9]+` (e.g., GSM2027569) will
	be associated to each sample.
- __Projects__/__Studies__ - Contain information on a biological research
	project. This holds all the data generated as part of this research (often
	coinciding with a publication). Accessions for Studies follow the regex
	pattern `(E|D|S)RP[0-9]{6,}` (e.g., SRP068092). However, these IDs are used
	(by ENA) as _Secondary Study Accessions_, since each _Study_ directly
	corresponds to a _BioProject_ entry whose ID `PRJ(E|D|N)[A-Z][0-9]+` (e.g.,
	PRJNA307652) is taken as the primary one. __This is the accession typically
	used in journal publications__. If data were brokered by GEO or ArrayExpress
	to INSDC's SRA, a _Study Alias_ accession of the type `GSE[0-9]+` (e.g.,
	GSE76528) or `E-[A-Z]{4}-[0-9]+` (e.g., E-MTAB-12021), respectively, will be
	also associated to the entire project.
- __Submissions__ - Metadata about the submission of the data to SRA. Accessions
	for Submissions follow the regex pattern `(E|D|S)RA[0-9]{6,}`.
- __Analyses__ - Hold results files of analyses performed on sequencing data
	(e.g., a genome assembly) and analysis methods. Accessions for Analyses
	follow the regex pattern `(E|D|S)RZ[0-9]{6,}`.

<div>
<br>
<table style="border-collapse: collapse; width: 85%; margin: auto;">
	<thead>
		<tr style="border: none;">
			<th>Accession Type</th>
			<th>Accession Format</th>
			<th>Example</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>
				<p>Run</p>
			</td>
			<td>
				<p><code>(E|D|S)RR[0-9]{6,}</code></p>
			</td>
			<td>
				<p>SRR3085451</p>
			</td>
		</tr>
		<tr>
			<td>
				<p>Experiment</p>
			</td>
			<td>
				<p><code>(E|D|S)RX[0-9]{6,}</code></p>
			</td>
			<td>
				<p>SRX1517159</p>
			</td>
		</tr>
		<tr>
			<td>
				<div>BioSample</div>
				<div>Sample</div>
				<div>GEO Sample Alias</div>
			</td>
			<td>
				<div><code>SAM(E|D|N)[A-Z]?[0-9]+</code></div>
				<div><code>(E|D|S)RS[0-9]{6,}</code></div>
				<div><code>GSM[0-9]+</code></div>
			</td>
			<td>
				<div>SAMN04384212</div>
				<div>SRS1235761</div>
				<div>GSM2027569</div>
			</td>
		</tr>
		<tr>
			<td>
				<div>BioProject</div>
				<div>Study</div>
				<div>GEO Series Alias</div>
				<div>AE Alias</div>
			</td>
			<td>
				<div><code>PRJ(E|D|N)[A-Z][0-9]+</code></div>
				<div><code>(E|D|S)RP[0-9]{6,}</code></div>
				<div><code>GSE[0-9]+</code></div>
				<div><code>E-[A-Z]{4}-[0-9]+</code></div>
			</td>
			<td>
				<div>PRJNA307652</div>
				<div>SRP068092</div>
				<div>GSE76528</div>
				<div>E-MTAB-12021</div>
			</td>
		</tr>
		<tr>
			<td>
				<p>Submission</p>
			</td>
			<td>
				<p><code>(E|D|S)RA[0-9]{6,}</code></p>
			</td>
			<td>
				<p>...</p>
			</td>
		</tr>
		<tr>
			<td>
				<p>Analysis</p>
			</td>
			<td>
				<p><code>(E|D|S)RZ[0-9]{6,}</code></p>
			</td>
			<td>
				<p>...</p>
			</td>
		</tr>
	</tbody>
</table>
<br>
</div>

## Ontological Perspective
An inspiring historical perspective on the origins of the INSDC initiative is
offered by Hallam Stevens in _Globalizing Genomics: The Origins of the
International Nucleotide Sequence Database Collaboration_ (J Hist Biol. 2018
Dec;51(4):657-691. PMID: [28986915](https://pubmed.ncbi.nlm.nih.gov/28986915/)
DOI: [10.1007/s10739-017-9490-y](https://link.springer.com/article/10.1007/s10739-017-9490-y)),
a paper examining the intrinsic transnational nature of the modern genomics and
its ontological implications relative to what DNA sequences came to be during
the Human Genome Project.

> _What constituted an "entry" or a "sequence" in the nucleotide databases was
not obvious or given, but had to be constituted through technical and social
work between EMBL-Bank and GenBank._

> _Smith_ (1998; On the Origin of Objects) _has argued that making decisions
about the representations and relations of objects inside software and databases
is doing more than merely computational work. Making such decisions about how to
structure objects inside computers, Smith says, has important implications for
what those objects actually are __in the world__. Programming and databasing
have __ontological__ implications. Here, it was precisely the international
exchanges between different databases that brought these issues to the
forefront, opening up debates about what objects __should__ look like and
__how__ they should be represented._

> _In practice, the data elements included in this "common schema" came to
define what a sequence was a global object. Sequences were less what was
represented at GenBank, or EMBL-Bank, or DDBJ, but rather more __what was
exchanged in common between them__. The "same complete set of sequence
information" that the databases were trying to provide to scientists everywhere
in the world was defined by the common schema that was worked out between the
databases._

> _The transnational nature of the database collaboration meant that sequence
had to become increasingly __abstracted__ from its points of origin, they had to
become increasingly __sharable__, and they had to become __mobile__ via
electronic media (and networks). This did not occur automatically, but was the
product of intensive work by databases managers at GenBank, EMBL-Bank, and at
DDBJ. It involved both negotiation, compromise, politics, but also the technical
work of establishing how databases could actually talk to one another via
electronic networks, translation, and standardization._

In his work, Stevens examined the early parts of this international
collaboration, from roughly 1979 to the mid-1990s. However, new issues and
challenges have emerged in more recent years, especially related to the
exponential growth rate of SRA, which in turn makes data handling increasingly
complicated and expensive, so that the resilience of the entire system seems to
be constantly at risk (see e.g.,
PMID: [21418618](https://pubmed.ncbi.nlm.nih.gov/21418618/),
PMID: [22144685](https://pubmed.ncbi.nlm.nih.gov/22144685/)).
Indeed, in February 2011, NCBI announced their plan to close the NCBI's SRA due
to funding reduction. However, EBI and DDBJ replied by announcing that they
would continue to support the SRA. Finally, in October 2011, NCBI announced
continuation of funding for the SRA by NIH. No other controversies of this
magnitude have emerged since, bur around the year 2020 NCBI has shifted SRA data
to commercial cloud environments, which offer storage options for different use
frequencies: _hot storage_ for highly accessed data and less expensive _cold
storage_ for older, less accessed studies.

## References
### INSDC Regular Reports
1. Cochrane G, Karsch-Mizrachi I, Nakamura Y; International Nucleotide Sequence
	Database Collaboration. _The International Nucleotide Sequence Database
	Collaboration._ __Nucleic Acids Res.__ 2011 Jan;39(Database issue):D15-8.
	DOI: 10.1093/nar/gkq1150. Epub 2010 Nov 23.
	PMID: [21106499](https://pubmed.ncbi.nlm.nih.gov/21106499/)
1. Karsch-Mizrachi I, Nakamura Y, Cochrane G; International Nucleotide Sequence
	Database Collaboration. _The International Nucleotide Sequence Database
	Collaboration._ __Nucleic Acids Res.__ 2012 Jan;40(Database issue):D33-7.
	DOI: 10.1093/nar/gkr1006. Epub 2011 Nov 12.
	PMID: [22080546](https://pubmed.ncbi.nlm.nih.gov/22080546/)
1. Nakamura Y, Cochrane G, Karsch-Mizrachi I; International Nucleotide Sequence
	Database Collaboration. _The International Nucleotide Sequence Database
	Collaboration._ __Nucleic Acids Res.__ 2013 Jan;41(Database issue):D21-4.
	DOI: 10.1093/nar/gks1084. Epub 2012 Nov 24.
	PMID: [23180798](https://pubmed.ncbi.nlm.nih.gov/23180798/)
1. Cochrane G, Karsch-Mizrachi I, Takagi T; International Nucleotide Sequence
	Database Collaboration. _The International Nucleotide Sequence Database
	Collaboration._ __Nucleic Acids Res.__ 2016 Jan 4;44(D1):D48-50.
	DOI: 10.1093/nar/gkv1323. Epub 2015 Dec 10.
	PMID: [26657633](https://pubmed.ncbi.nlm.nih.gov/26657633/)
1. Karsch-Mizrachi I, Takagi T, Cochrane G; International Nucleotide Sequence
	Database Collaboration. _The International Nucleotide Sequence Database
	Collaboration._ __Nucleic Acids Res.__ 2018 Jan 4;46(D1):D48-D51.
	DOI: 10.1093/nar/gkx1097.
	PMID: [29190397](https://pubmed.ncbi.nlm.nih.gov/29190397/)
1. Arita M, Karsch-Mizrachi I, Cochrane G. _The International Nucleotide
	Sequence Database Collaboration._ __Nucleic Acids Res.__ 2021 Jan
	8;49(D1):D121-D124. DOI: 10.1093/nar/gkaa967.
	PMID: [33166387](https://pubmed.ncbi.nlm.nih.gov/33166387/)

### Historical - Ontological
1. Stevens H. _Globalizing Genomics: The Origins of the International Nucleotide
	Sequence Database Collaboration._ __J Hist Biol.__ 2018 Dec;51(4):657-691.
	DOI: 10.1007/s10739-017-9490-y.
	PMID: [28986915](https://pubmed.ncbi.nlm.nih.gov/28986915/)
1. Lipman D, Flicek P, Salzberg S, Gerstein M, Knight R. _Closure of the NCBI
	SRA and implications for the long-term future of genomics data storage._
	__Genome Biol.__ 2011;12(3):402. DOI: 10.1186/gb-2011-12-3-402. Epub 2011
	Mar 22. PMID: [21418618](https://pubmed.ncbi.nlm.nih.gov/21418618/)
1. Galperin MY, Fernández-Suárez XM. _The 2012 Nucleic Acids Research Database
	Issue and the online Molecular Biology Database Collection._ __Nucleic Acids
	Res.__ 2012 Jan;40(Database issue):D1-8. DOI: 10.1093/nar/gkr1196. Epub 2011
	Dec 5. PMID: [22144685](https://pubmed.ncbi.nlm.nih.gov/22144685/)
1. Smith BC. _On the Origin of Objects._ __The MIT Press__ 1998 ISBN electronic:
	9780262283946. DOI: https://doi.org/10.7551/mitpress/5128.001.0001

### Web Resources
1. ENA Guidelines and Tutorials: https://ena-docs.readthedocs.io/en/latest/index.html
1. ENA Accession Numbers: https://ena-docs.readthedocs.io/en/latest/submit/general-guide/accessions.html
1. Kurt Wheeler ([The Childhood Cancer Data Lab](https://www.ccdatalab.org/),
	[refine.bio](https://www.refine.bio/) project),
	Gene Expression Repositories Explained: https://www.ccdatalab.org/blog/gene-expression-repositories-explained
