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
use AppBundle\Form\StagesType;
use AppBundle\Entity\Stages;
use Symfony\Component\Validator\Constraints as Assert;


/**
 * Stage controller.
 *
 */
class StagesController extends Controller
{
    /**
     * Lists all stage entities.
     *
     * @Rest\View()
     * @Rest\Get("/stages")
     * @Security("has_role(2) || has_role(3)")
     */
    public function indexAction()
    {
        $em = $this->getDoctrine()->getManager();

        $stages = $em->getRepository('AppBundle:Stages')->findAll();

        return $stages;
    }

    /**
     * Creates a new stage entity.
     *
     * @Rest\View(statusCode=Response::HTTP_CREATED)
     * @Rest\Post("/stages/new")
     * @Security("has_role(2) || has_role(3)")
     */
    public function newAction(Request $request)
    {
        $stages = new Stages();

        $em = $this->getDoctrine()->getManager();
        $metiers = $em->getRepository('AppBundle:Metiers')->find($request->get('id_metier'));

        $dateDebut = $request->get('date_debut');
        $dateFin = $request->get('date_fin');

        if (\DateTime::createFromFormat('Y-m-d', $request->get('date_debut')) == FALSE || \DateTime::createFromFormat('Y-m-d', $request->get('date_fin')) == FALSE) {
            return new JsonResponse(["message_err" => "Le format doit être de type date"]);
        }

        $stages->setIdMetier($metiers)
        ->setDateDebut($dateDebut)
        ->setDateFin($dateFin);

        if ($stages->getIdMetier() == null || $stages->getDateDebut() == null || $stages->getDateFin() == null) {
            return new JsonResponse(["message_err" => "Tous les champs ne sont pas remplis !"]);
        }
        $em = $this->get('doctrine.orm.entity_manager');
        $em->persist($stages);
        $em->flush();

        return $stages;
    }

    /**
     * Finds and displays a stage entity.
     *
     * @Rest\View()
     * @Rest\Get("/stages/{id}")
     * @Security("has_role(2) || has_role(3) || has_role(0)")
     */
    public function showAction($id)
    {
        $em = $this->getDoctrine()->getManager();

        $stages = $em->getRepository('AppBundle:Stages')->find($id);

        return $stages;
    }

    /**
     * @Rest\View()
     * @Rest\Patch("/stages/{id}")
     * @Security("has_role(2) || has_role(3)")
     */
    public function patchStagesAction(Request $request)
    {
        return $this->updateStages($request);
    }

    public function updateStages(Request $request)
    {
        $stages = $this->get('doctrine.orm.entity_manager')
        ->getRepository('AppBundle:Stages')
        ->find($request->get('id'));

        if (empty($stages)) {
            return new JsonResponse(['message_err' => "Le stage est introuvable !"], Response::HTTP_NOT_FOUND);
        }

        $form = $this->createForm(StagesType::class, $stages);
        $form->submit($request->request->all(), false);
        if (\DateTime::createFromFormat('Y-m-d', $request->get('dateDebut')) == FALSE || \DateTime::createFromFormat('Y-m-d', $request->get('dateFin')) == FALSE) {
            return new JsonResponse(["message_err" => "Le format doit être de type date"]);
        }

        if ($form->isValid()) {
            $em = $this->get('doctrine.orm.entity_manager');
            $em->persist($stages);
            $em->flush();
            return $stages;
        } else {
            return $form;
        }
    }

    /**
     * Deletes a stage entity.
     *
     * @Rest\View(statusCode=Response::HTTP_NO_CONTENT)
     * @Rest\Delete("/stages/{id}")
     * @Security("has_role(2) || has_role(3)")
     */
    public function deleteAction(Request $request, Stages $stage)
    {
        $em = $this->get('doctrine.orm.entity_manager');
        $stages = $em->getRepository('AppBundle:Stages')
        ->find($request->get('id'));

        if ($stages) {
            $em->remove($stages);
            $em->flush();
            return new JsonResponse(["message" => "Le stage a bien été supprimé !"]);
        }
        else
            return new JsonResponse(["message_err" => "Le stage est introuvable !"]);
    }
}
