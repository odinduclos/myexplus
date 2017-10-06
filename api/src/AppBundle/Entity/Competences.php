<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Competences
 *
 * @ORM\Table(name="competences", indexes={@ORM\Index(name="competences_fk0", columns={"id_metier"})})
 * @ORM\Entity
 */
class Competences
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
     * @var string
     *
     * @ORM\Column(name="titre", type="string", length=255, nullable=false)
     */
    private $titre;

    /**
     * @var string
     *
     * @ORM\Column(name="type", type="string", length=255, nullable=false)
     */
    private $type;

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
     * Set titre
     *
     * @param string $titre
     *
     * @return Competences
     */
    public function setTitre($titre)
    {
        $this->titre = $titre;

        return $this;
    }

    /**
     * Get titre
     *
     * @return string
     */
    public function getTitre()
    {
        return $this->titre;
    }

    /**
     * Set type
     *
     * @param string $type
     *
     * @return Competences
     */
    public function setType($type)
    {
        $this->type = $type;

        return $this;
    }

    /**
     * Get type
     *
     * @return string
     */
    public function getType()
    {
        return $this->type;
    }

    /**
     * Set idMetier
     *
     * @param \AppBundle\Entity\Metiers $idMetier
     *
     * @return Competences
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
