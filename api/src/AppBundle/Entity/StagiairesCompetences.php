<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * StagiairesCompetences
 *
 * @ORM\Table(name="stagiaires_competences", indexes={@ORM\Index(name="stagiaires_competences_fk0", columns={"id_stagiaire"}), @ORM\Index(name="stagiaires_competences_fk1", columns={"id_competence"})})
 * @ORM\Entity
 */
class StagiairesCompetences
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
     * @var boolean
     *
     * @ORM\Column(name="validation_stagiaire", type="boolean", nullable=false)
     */
    private $validationStagiaire;

    /**
     * @var integer
     *
     * @ORM\Column(name="note_stagiaire", type="integer", nullable=false)
     */
    private $noteStagiaire;

    /**
     * @var boolean
     *
     * @ORM\Column(name="validation_maitre_de_stage", type="boolean", nullable=false)
     */
    private $validationMaitreDeStage;

    /**
     * @var integer
     *
     * @ORM\Column(name="note_maitre_de_stage", type="integer", nullable=false)
     */
    private $noteMaitreDeStage;

    /**
     * @var boolean
     *
     * @ORM\Column(name="validation_responsable", type="boolean", nullable=false)
     */
    private $validationResponsable;

    /**
     * @var \AppBundle\Entity\Competences
     *
     * @ORM\ManyToOne(targetEntity="AppBundle\Entity\Competences")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="id_competence", referencedColumnName="id")
     * })
     */
    private $idCompetence;


    /**
     * @var \AppBundle\Entity\Stagiaires
     *
     * @ORM\ManyToOne(targetEntity="AppBundle\Entity\Stagiaires")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="id_stagiaire", referencedColumnName="id")
     * })
     */

    private $idStagiaire;
     /**
     * Set idStagiaire
     *
     * @param \AppBundle\Entity\Stagiaires $idStagiaire
     *
     * @return StagiairesCompetences
     */
     public function setIdStagiaire(\AppBundle\Entity\Stagiaires $idStagiaire = null)
     {
        $this->idStagiaire = $idStagiaire;


        return $this;
    }

    /**
     * Get idStagiaire
     *
     * @return \AppBundle\Entity\Stagiaires
     */
    public function getIdStagiaire()
    {
        return $this->idStagiaire;
    }

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
     * Set validationStagiaire
     *
     * @param boolean $validationStagiaire
     *
     * @return StagiairesCompetences
     */
    public function setValidationStagiaire($validationStagiaire)
    {
        $this->validationStagiaire = $validationStagiaire;

        return $this;
    }

    /**
     * Get validationStagiaire
     *
     * @return boolean
     */
    public function getValidationStagiaire()
    {
        return $this->validationStagiaire;
    }

    /**
     * Set noteStagiaire
     *
     * @param integer $noteStagiaire
     *
     * @return StagiairesCompetences
     */
    public function setNoteStagiaire($noteStagiaire)
    {
        $this->noteStagiaire = $noteStagiaire;

        return $this;
    }

    /**
     * Get noteStagiaire
     *
     * @return integer
     */
    public function getNoteStagiaire()
    {
        return $this->noteStagiaire;
    }

    /**
     * Set validationMaitreDeStage
     *
     * @param boolean $validationMaitreDeStage
     *
     * @return StagiairesCompetences
     */
    public function setValidationMaitreDeStage($validationMaitreDeStage)
    {
        $this->validationMaitreDeStage = $validationMaitreDeStage;

        return $this;
    }

    /**
     * Get validationMaitreDeStage
     *
     * @return boolean
     */
    public function getValidationMaitreDeStage()
    {
        return $this->validationMaitreDeStage;
    }

    /**
     * Set noteMaitreDeStage
     *
     * @param integer $noteMaitreDeStage
     *
     * @return StagiairesCompetences
     */
    public function setNoteMaitreDeStage($noteMaitreDeStage)
    {
        $this->noteMaitreDeStage = $noteMaitreDeStage;

        return $this;
    }

    /**
     * Get noteMaitreDeStage
     *
     * @return integer
     */
    public function getNoteMaitreDeStage()
    {
        return $this->noteMaitreDeStage;
    }

    /**
     * Set validationResponsable
     *
     * @param boolean $validationResponsable
     *
     * @return StagiairesCompetences
     */
    public function setValidationResponsable($validationResponsable)
    {
        $this->validationResponsable = $validationResponsable;

        return $this;
    }

    /**
     * Get validationResponsable
     *
     * @return boolean
     */
    public function getValidationResponsable()
    {
        return $this->validationResponsable;
    }

    /**
     * Set idCompetence
     *
     * @param \AppBundle\Entity\Competences $idCompetence
     *
     * @return StagiairesCompetences
     */
    public function setIdCompetence(\AppBundle\Entity\Competences $idCompetence = null)
    {
        $this->idCompetence = $idCompetence;

        return $this;
    }

    /**
     * Get idCompetence
     *
     * @return \AppBundle\Entity\Competences
     */
    public function getIdCompetence()
    {
        return $this->idCompetence;
    }
    /**
     * @var integer
     */
    private $competenceStagiaire;

    /**
     * @var integer
     */
    private $competenceMaitreDeStage;


    /**
     * Set competenceStagiaire
     *
     * @param integer $competenceStagiaire
     *
     * @return StagiairesCompetences
     */
    public function setCompetenceStagiaire($competenceStagiaire)
    {
        $this->competenceStagiaire = $competenceStagiaire;

        return $this;
    }

    /**
     * Get competenceStagiaire
     *
     * @return integer
     */
    public function getCompetenceStagiaire()
    {
        return $this->competenceStagiaire;
    }

    /**
     * Set competenceMaitreDeStage
     *
     * @param integer $competenceMaitreDeStage
     *
     * @return StagiairesCompetences
     */
    public function setCompetenceMaitreDeStage($competenceMaitreDeStage)
    {
        $this->competenceMaitreDeStage = $competenceMaitreDeStage;

        return $this;
    }

    /**
     * Get competenceMaitreDeStage
     *
     * @return integer
     */
    public function getCompetenceMaitreDeStage()
    {
        return $this->competenceMaitreDeStage;
    }
    /**
     * @var \AppBundle\Entity\Stages
     */
    private $idStage;


    /**
     * Set idStage
     *
     * @param \AppBundle\Entity\Stages $idStage
     *
     * @return StagiairesCompetences
     */
    public function setIdStage(\AppBundle\Entity\Stages $idStage = null)
    {
        $this->idStage = $idStage;

        return $this;
    }

    /**
     * Get idStage
     *
     * @return \AppBundle\Entity\Stages
     */
    public function getIdStage()
    {
        return $this->idStage;
    }
}
