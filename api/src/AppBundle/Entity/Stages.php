<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Stages
 *
 * @ORM\Table(name="stages", indexes={@ORM\Index(name="stages_fk0", columns={"id_metier"})})
 * @ORM\Entity
 */
class Stages
{
    /**
     * @var integer
     *
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="IDENTITY")
     */
    private $id;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="date_debut", type="date", nullable=false)
     */
    private $dateDebut;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="date_fin", type="date", nullable=false)
     */
    private $dateFin;

    /**
     * @var \AppBundle\Entity\Metiers
     *
     * @ORM\ManyToOne(targetEntity="AppBundle\Entity\Metiers")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="id_metier", referencedColumnName="id")
     * })
     */
    private $idMetier;



    /**
     * Get id
     *
     * @return integer
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set dateDebut
     *
     * @param \DateTime $dateDebut
     *
     * @return Stages
     */
    public function setDateDebut($dateDebut)
    {
        $this->dateDebut = $dateDebut;

        return $this;
    }

    /**
     * Get dateDebut
     *
     * @return \DateTime
     */
    public function getDateDebut()
    {
        return $this->dateDebut;
    }

    /**
     * Set dateFin
     *
     * @param \DateTime $dateFin
     *
     * @return Stages
     */
    public function setDateFin($dateFin)
    {
        $this->dateFin = $dateFin;

        return $this;
    }

    /**
     * Get dateFin
     *
     * @return \DateTime
     */
    public function getDateFin()
    {
        return $this->dateFin;
    }

    /**
     * Set idMetier
     *
     * @param \AppBundle\Entity\Metiers $idMetier
     *
     * @return Stages
     */
    public function setIdMetier(\AppBundle\Entity\Metiers $idMetier = null)
    {
        $this->idMetier = $idMetier;

        return $this;
    }

    /**
     * Get idMetier
     *
     * @return \AppBundle\Entity\Metiers
     */
    public function getIdMetier()
    {
        return $this->idMetier;
    }
}
