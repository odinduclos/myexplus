<?php

namespace AppBundle\Controller;


use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Symfony\Component\HttpFoundation\Session\Session;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Security;
use FOS\RestBundle\Controller\Annotations as Rest;
use AppBundle\Form\CompetencesType;
use AppBundle\Entity\Competences;
use AppBundle\Entity\StagiairesCompetences;
use AppBundle\Entity\Stages;

/**
 * Competence controller.
 *
 */
class CompetencesController extends Controller
{
    /**
     * Lists all stagiaire entities.
     *
     * @Rest\View()
     * @Rest\Get("/competences")
     * @Security("has_role(2) || has_role(3)")
     */
    public function indexAction()
    {
        $em = $this->getDoctrine()->getManager();

        $competences = $em->getRepository('AppBundle:Competences')->findAll();

        return $competences;
    }

     /**
     * @Rest\View()
     * @Rest\Get("/competencesmetier/{id}")
     * @Security("has_role(2) || has_role(3)")
     */
     public function competencesmetier($id)
     {
        $em = $this->getDoctrine()->getManager();

        $competences = $em->getRepository('AppBundle:Competences')->findByIdMetier($id);

        return $competences;
    }

    /**
     * Creates a new competence entity.
     *
     * @Rest\View(statusCode=Response::HTTP_CREATED)
     * @Rest\Post("/competences/new")
     * @Security("has_role(2) || has_role(3)")
     */
    public function newAction(Request $request)
    {
        $em = $this->get('doctrine.orm.entity_manager');

        $competences = new Competences();
        
        $em = $this->getDoctrine()->getManager();
        $metiers = $em->getRepository('AppBundle:Metiers')->find($request->get('id_metier'));

        $competences->setIdMetier($metiers)
        ->setTitre($request->get('titre'))
        ->setType($request->get('type'));

        if ($competences->getIdMetier() == null || $competences->getType() == null || $competences->getTitre() == null) {
            return new JsonResponse(["message_err" => "Tous les champs ne sont pas remplis !"]);
        }
    
        $em->persist($competences);

        $stages = $em->getRepository('AppBundle:Stages')->findByIdMetier($request->get('id_metier'));
        foreach ($stages as $stage) {

            $stagiairescompetences = new Stagiairescompetences();
            $stagiairescompetences
            ->setIdStage($stage)
            ->setIdCompetence($competences)
            ->setValidationStagiaire(0)
            ->setNoteStagiaire(0)
            ->setCompetenceStagiaire(0)
            ->setValidationMaitreDeStage(0)
            ->setNoteMaitreDeStage(0)
            ->setCompetenceMaitreDeStage(0)
            ->setValidationResponsable(0);

            $em->persist($stagiairescompetences);
            // $em->flush();
        }

        $em->flush();
        return $competences;
    }

    /**
     * Finds and displays a competence entity.
     *
     * @Rest\View()
     * @Rest\Get("/competences/{id}")
     * @Security("has_role(2) || has_role(3)")
     */
    public function showAction($id)
    {
        $em = $this->getDoctrine()->getManager();

        $competences = $em->getRepository('AppBundle:Competences')->find($id);

        return $competences;
    }

    /**
     * Displays a form to edit an existing competence entity.
     *
     * @Rest\View()
     * @Rest\Patch("/competences/{id}")
     * @Security("has_role(2) || has_role(3)")
     */
    public function patchCompetencesAction(Request $request)
    {
        return $this->updateCompetences($request);
    }

    public function updateCompetences(Request $request)
    {
        $competences = $this->get('doctrine.orm.entity_manager')
        ->getRepository('AppBundle:Competences')
        ->find($request->get('id'));

        if (empty($competences)) {
            return new JsonResponse(['message_err' => "La compétence est introuvable !"], Response::HTTP_NOT_FOUND);
        }

        $form = $this->createForm(CompetencesType::class, $competences);
        $form->submit($request->request->all(), false);

        if ($form->isValid()) {
            $em = $this->get('doctrine.orm.entity_manager');
            $em->persist($competences);
            $em->flush();
            return $competences;
        } else {
            return $form;
        }
    }

    /**
     * Deletes a competence entity.
     *
     * @Rest\View(statusCode=Response::HTTP_NO_CONTENT)
     * @Rest\Delete("/competences/{id}")
     * @Security("has_role(2) || has_role(3)")
     */
    public function deleteAction(Request $request)
    {
        $em = $this->get('doctrine.orm.entity_manager');
        $competences = $em->getRepository('AppBundle:Competences')
        ->find($request->get('id'));

        if ($competences) {
            $em->remove($competences);
            $em->flush();
            return new JsonResponse(["message" => "Le compétence a bien été supprimé !"]);
        }
        else
            return new JsonResponse(["message_err" => "Le compétence est introuvable !"]);
    }
}
